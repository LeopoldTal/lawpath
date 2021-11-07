import React from 'react';
import { render, screen } from '@testing-library/react';
import LawpathForm from './LawpathForm';

describe('form layout', () => {
	it('has a title', () => {
		render(<LawpathForm />);
		const titleElement = screen.getByText(/Validate an Australian address/);
		expect(titleElement).toBeInTheDocument();
	});

	it('has a postcode field', () => {
		render(<LawpathForm />);
		const postcodeInput = screen.getByLabelText(/Postcode/i);
		expect(postcodeInput).toBeInTheDocument();
	});

	it('has a suburb field', () => {
		render(<LawpathForm />);
		const suburbInput = screen.getByLabelText(/Suburb/i);
		expect(suburbInput).toBeInTheDocument();
	});

	it('has a state field', () => {
		render(<LawpathForm />);
		const stateInput = screen.getByLabelText(/State/i);
		expect(stateInput).toBeInTheDocument();
	});

	it('lists the states', () => {
		render(<LawpathForm />);

		const stateNames = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
		stateNames.forEach(stateName => {
			const stateOption = screen.getByText(stateName);
			expect(stateOption).toBeInTheDocument();
		});
	});
});

describe('validation results', () => {
	// TODO
});
