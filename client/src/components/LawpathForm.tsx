// The main form
// Allows the user to enter and validate an address

import React, { FormEvent, useState } from 'react';
import { validateAddress } from '../api-client/api-client';
import { AustralianState } from '../models/address';
import { ValidationResult, ValidationStatus } from '../models/validation';
import ValidationDisplay from './ValidationDisplay';

const LawpathForm: React.FunctionComponent = () => {
	// Address
	const [postcode, setPostcode] = useState('');
	const [suburb, setSuburb] = useState('');
	const [ausState, setAusState] = useState<AustralianState | null>(null);

	// Validation
	const [validationResult, setValidationResult] = useState<ValidationResult>({
		address: {},
		validationStatus: 'unchecked'
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSelectAusState = (ev: FormEvent<HTMLSelectElement>) => {
		const value = (ev.target as HTMLSelectElement).value as AustralianState;
		if (Object.values(AustralianState).includes(value)) {
			setAusState(value);
		}
	};

	const handleSubmit = async (ev: FormEvent) => {
		ev.preventDefault();

		// Keep track of the address that was validated
		const address = { postcode, suburb, state: ausState as AustralianState };
		const setValidationStatus = (validationStatus: ValidationStatus) => setValidationResult({
			address,
			validationStatus
		});

		if (!postcode || !suburb || !ausState) {
			setValidationStatus('missingRequiredFields');
			return;
		}
		setIsLoading(true);
		try {
			const { status } = await validateAddress({
				postcode,
				suburb,
				state: ausState as AustralianState
			});
			setValidationStatus(status);
		} catch (e) {
			console.error(e);
			setValidationStatus('error');
		}
		setIsLoading(false);
	}

	return (
		<form name="addressValidation" className="m-5" onSubmit={handleSubmit}>
			<h1 className="mb-3">Validate an Australian address</h1>
			<p>
				<label htmlFor="postcode" className="form-label">Postcode: </label>
				<input
					type="text"
					name="postcode"
					id="postcode"
					minLength={4}
					maxLength={4}
					pattern="\d+"
					className="form-control"
					onChange={(ev) => setPostcode(ev.target.value)}
				/>
			</p>
			<p>
				<label htmlFor="suburb" className="form-label">Suburb: </label>
				<input
					type="text"
					name="suburb"
					id="suburb"
					className="form-control"
					onChange={(ev) => setSuburb(ev.target.value.trim())}
				/>
			</p>
			<p>
				<label htmlFor="ausState" className="form-label">State: </label>
				<select
					name="ausState"
					id="ausState"
					value={ausState || ''}
					className="form-select"
					onChange={handleSelectAusState}
				>
					<option hidden value=""></option>
					{Object.values(AustralianState).map(state => (
						<option
							key={state}
							value={state}
						>{state}</option>
					))}
				</select>
			</p>
			<p>
				<button
					type="submit"
					className="btn btn-primary my-2"
				>
					Validate
				</button>
			</p>
			<ValidationDisplay
				isLoading={isLoading}
				{...validationResult}
			/>
		</form>
	);
};

export default LawpathForm;
