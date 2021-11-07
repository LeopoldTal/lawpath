import React from 'react';
import { render, screen } from '@testing-library/react';
import { Address, AustralianState } from '../models/address';
import ValidationDisplay from './ValidationDisplay';

describe('ValidationDisplay', () => {
	const address: Address = {
		postcode: '3000',
		suburb: 'Melbourne',
		state: AustralianState.VIC
	};

	const defaultProps = {
		address,
		isLoading: false
	};

	const expectText = (message: RegExp) => {
		expect(screen.getByText(message)).toBeInTheDocument();
	}

	it('indicates loading', () => {
		render(<ValidationDisplay
			isLoading={true}
			address={address}
			validationStatus="valid"
		/>);
		expectText(/Loading…/);
	});

	it('reports missing fields', () => {
		render(<ValidationDisplay
			isLoading={false}
			address={{}}
			validationStatus="missingRequiredFields"
		/>);
		expectText(/Please fill in all the fields./);
	});

	it('is blank if the validation has not run', () => {
		const { container } = render(<ValidationDisplay
			{...defaultProps}
			validationStatus="unchecked"
		/>);
		expect(container.textContent).toBe('');
	});

	it('reports postcode-suburb mismatch', () => {
		render(<ValidationDisplay
			{...defaultProps}
			validationStatus="postcodeSuburbMismatch"
		/>);
		expectText(/The postcode 3000 does not match the suburb Melbourne./);
	});

	it('reports suburb-state mismatch', () => {
		render(<ValidationDisplay
			{...defaultProps}
			validationStatus="suburbStateMismatch"
		/>);
		expectText(/The suburb Melbourne does not exist in the state VIC./);
	});

	it('reports a valid address', () => {
		render(<ValidationDisplay
			{...defaultProps}
			validationStatus="valid"
		/>);
		expectText(/Melbourne 3000 VIC is a valid address./);
	});

	it('reports an error', () => {
		render(<ValidationDisplay
			{...defaultProps}
			validationStatus="error"
		/>);
		expectText(/Something went wrong, please try again./);
	});
});
