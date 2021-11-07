import { Address } from './address';

// Possible states of the address form
export type ValidationStatus =
	'unchecked'
	| 'valid'
	| 'missingRequiredFields'
	| 'postcodeSuburbMismatch'
	| 'suburbStateMismatch'
	| 'error';

// The result of validating an address:
// - the address that was validated
// - the resulting status
export type ValidationResult = {
	address: Partial<Address>;
	validationStatus: ValidationStatus;
};
