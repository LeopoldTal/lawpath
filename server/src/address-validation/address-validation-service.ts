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
type ValidationResponse = {
	status: ValidationStatus;
}

// Validate an address and returns whether the validation succeeded.
export const validateAddress = async (address: Partial<Address>): Promise<ValidationResponse> => {
	// TODO
	searchAddress(address).then(console.log);
	return { status: 'valid' };
};
