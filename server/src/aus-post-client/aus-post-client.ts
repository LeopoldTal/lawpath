// Australia Post API client

import fetch from 'node-fetch';
import { stringify } from 'qs';
import { getAusPostApiConfig } from '../config/config-service';
import { Address } from '../models/address';

export const searchAddress = ({
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

	console.log(url, ausPostApiKey);
	return fetch(url, {
		headers: {
			'Auth-Key': ausPostApiKey,
			Accept: 'application/json'
		}
	})
		.then(res => res.json())
		.then(toAddresses);
};

type Locality = {
	postcode: string;
	location: string;
	state: string;
};

type AusPostApiResponse = {
	error?: unknown;
	localities?: {
		locality: Locality[];
	}
};

const toAddresses = ({ error, localities }: AusPostApiResponse): Address[] => {
	if (error) {
		throw new Error(`Error from Australia Post Api: ${JSON.stringify(error, null, 2)}`);
	}

	if (!localities || !localities.locality) {
		return [];
	}

	return localities.locality.map(({ postcode, location, state }) => ({
		postcode: postcode.toString(),
		suburb: location,
		state
	}));
};
