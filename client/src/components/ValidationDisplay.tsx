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

	// This needlessly computes messages that aren't displayed
	// Ok in this case but could be a problem with complex formatting
	const messages: { [key in ValidationStatus]: string } = {
		unchecked: '',
		valid: `✅ ${suburb} ${postcode} ${state} is a valid address.`,
		missingRequiredFields: '🖊️ Please fill in all the fields.',
		postcodeSuburbMismatch: `❌ The postcode ${postcode} does not match the suburb ${suburb}.`,
		suburbStateMismatch: `❌ The suburb ${suburb} does not exist in the state ${state}.`,
		error: '🖥️ Something went wrong, please try again.'
	};
	const statusMessage = messages[validationStatus];

	const messageClasses: { [key in ValidationStatus]: string } = {
		unchecked: '',
		valid: 'alert-success',
		missingRequiredFields: 'alert-danger',
		postcodeSuburbMismatch: 'alert-warning',
		suburbStateMismatch: 'alert-warning',
		error: 'alert-danger'
	};
	const messageClass = messageClasses[validationStatus];

	return (
		<p className={`message alert ${messageClass}`}>{statusMessage}</p>
	);
};

export default ValidationDisplay;
