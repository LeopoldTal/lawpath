// Shows the result of attempting to validate an address

import React from 'react';
import { ValidationResult, ValidationStatus } from '../models/validation';

type ValidationDisplayProps = ValidationResult & {
	isLoading: boolean;
};

const ValidationDisplay: React.FunctionComponent<ValidationDisplayProps> = ({
	isLoading,
	address: { postcode, suburb, state },
	validationStatus
}) => {
	if (isLoading) {
		return <p>Loading…</p>;
	}

	// TODO: would be nice to indicate status with some colourful class. Pull in Bootstrap?

	// This needlessly computes messages that aren't displayed
	// Ok in this case but could be a problem with complex formatting
	const messages: { [key in ValidationStatus]: string } = {
		unchecked: '',
		valid: `${suburb} ${postcode} ${state} is a valid address.`,
		missingRequiredFields: 'Please fill in all the fields.',
		postcodeSuburbMismatch: `The postcode ${postcode} does not match the suburb ${suburb}.`,
		suburbStateMismatch: `The suburb ${suburb} does not exist in the state ${state}.`,
		error: 'Something went wrong, please try again.'
	};
	const statusMessage = messages[validationStatus];

	return (
		<p>{statusMessage}</p>
	);
};

export default ValidationDisplay;
