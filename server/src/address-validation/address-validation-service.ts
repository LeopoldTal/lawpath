// Main service
// Validates an Australian address using the Auspost API

import { searchAddress } from '../aus-post-client/aus-post-client';
import { Address } from '../models/address';

type ValidationStatus =
	'valid'
	| 'missingRequiredFields'
	| 'postcodeSuburbMismatch'
	| 'suburbStateMismatch'
	| 'error';

// If needed, this could be extended with more fields, such as:
// - the input address
// - multiple failure causes rather than just the first one
// - details of the error if any
// - suggestions for corrected addresses
type ValidationResponse = {
	status: ValidationStatus;
}

// Validate an address and returns whether the validation succeeded.
export const validateAddress = async ({
	postcode,
	suburb,
	state
}: Partial<Address>): Promise<ValidationResponse> => {
	console.debug('Validating address:', { postcode, suburb, state });

	if (!postcode || !suburb || !state) {
		return { status: 'missingRequiredFields' };
	}

	try {
		const postcodeFields = { postcode, suburb };
		const postcodeAddresses = await searchAddress(postcodeFields);
		if (!matchAddressFields(postcodeFields, postcodeAddresses)) {
			return { status: 'postcodeSuburbMismatch' };
		}

		const stateFields = { suburb, state };
		const stateAddresses = await searchAddress(stateFields);
		if (!matchAddressFields(stateFields, stateAddresses)) {
			return { status: 'suburbStateMismatch' };
		}

		return { status: 'valid' };
	} catch (e) {
		console.error(e);
		return { status: 'error' };
	}
};

// Test whether an address with the specified field is present in the collection
export const matchAddressFields = (needle: Partial<Address>, haystack: Address[]): boolean =>
	haystack.some(address => matchSingleAddress(needle, address));

const matchSingleAddress = (needle: Partial<Address>, candidate: Address) =>
	Object.keys(needle).every(fieldName => {
		const key = fieldName as keyof Address;
		return !needle[key] || matchSingleField(needle[key] as string, candidate[key]);
	});

const matchSingleField = (a: string, b: string) =>
	a.localeCompare(b, 'en', { sensitivity: 'base' }) === 0;
