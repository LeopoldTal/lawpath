// Australia Post API client

import fetch from 'node-fetch';
import { stringify } from 'qs';
import { getAusPostApiConfig } from '../config/config-service';
import { Address } from '../models/address';

// Look up an address by some combination of postcode, suburb, and state
export const searchAddress = async ({
	postcode,
	suburb,
	state
}: Partial<Address>) => {
	const { ausPostApiUrl, ausPostApiKey } = getAusPostApiConfig();

	const search = stringify({
		q: [postcode, suburb].filter(s => s).join(' '),
		state
	});
	const url = `${ausPostApiUrl}/postcode/search.json?${search}`;

	console.debug(`GET ${url}`);
	const foundAddresses = await fetch(url, {
		headers: {
			'Auth-Key': ausPostApiKey,
			Accept: 'application/json'
		}
	})
		.then(res => res.json())
		.then(toAddresses);

	console.debug('Found addresses', foundAddresses);
	return foundAddresses;
};

// Auspost API response types
type Locality = {
	postcode: string;
	location: string;
	state: string;
};

type AusPostApiResponse = {
	error?: unknown;
	localities?: {
		// A very strange return type… probably `localities` was meant to hold the array
		locality: Locality | Locality[];
	}
};

// Parse the response
const toAddresses = ({ error, localities }: AusPostApiResponse): Address[] => {
	// The API can return 200 OK with an error message
	if (error) {
		throw new Error(`Error from Australia Post Api: ${JSON.stringify(error, null, 2)}`);
	}

	if (!localities || !localities.locality) {
		return [];
	}

	if (Array.isArray(localities.locality)) {
		return localities.locality.map(localityToAddress);
	} else {
		return [localityToAddress(localities.locality)];
	}
};

const localityToAddress = ({ postcode, location, state }: Locality): Address => ({
	postcode: postcode.toString(),
	suburb: location,
	state
});
