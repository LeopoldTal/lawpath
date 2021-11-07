// Possible states of the address form
export type ValidationStatus =
	'unchecked'
	| 'valid'
	| 'missingRequiredFields'
	| 'postcodeSuburbMismatch'
	| 'suburbStateMismatch'
	| 'error';
