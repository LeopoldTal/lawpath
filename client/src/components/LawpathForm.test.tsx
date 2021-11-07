import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LawpathForm from './LawpathForm';
import { validateAddress } from '../api-client/api-client';

jest.mock('../api-client/api-client', () => ({
	validateAddress: jest.fn()
}));

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

	describe('state select', () => {
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

		it('selects a state', () => {
			render(<LawpathForm />);
			const stateInput = screen.getByLabelText(/State/i) as HTMLSelectElement;
			fireEvent.change(stateInput, { target: { value: 'VIC' } });

			expect(stateInput.value).toBe('VIC');
		});

		it('rejects an invalid selection', () => {
			render(<LawpathForm />);
			const stateInput = screen.getByLabelText(/State/i) as HTMLSelectElement;
			fireEvent.change(stateInput, { target: { value: 'not a real state' } });

			expect(stateInput.value).toBe('');
		});
	});

	it('shows a validation button', () => {
		render(<LawpathForm />);

		const buttonElement = screen.getByRole('button');
		expect(buttonElement).toHaveTextContent(/Validate/i);
	});
});

describe('validation results', () => {
	beforeEach(() => {
		(validateAddress as any).mockImplementation(
			() => Promise.resolve({ status: 'postcodeSuburbMismatch' })
		);
	});

	const fillForm = () => {
		render(<LawpathForm />);

		const postcodeInput = screen.getByLabelText(/Postcode/i);
		fireEvent.change(postcodeInput, { target: { value: '1234' } });

		const suburbInput = screen.getByLabelText(/Suburb/i);
		fireEvent.change(suburbInput, { target: { value: 'Melbourne' } });

		const stateInput = screen.getByLabelText(/State/i);
		fireEvent.change(stateInput, { target: { value: 'VIC' } });

		const buttonElement = screen.getByRole('button');
		fireEvent.click(buttonElement);
	};

	const expectText = (message: RegExp) => {
		expect(screen.getByText(message)).toBeInTheDocument();
	};

	it('aborts validation if fields are not filled in', () => {
		render(<LawpathForm />);

		const buttonElement = screen.getByRole('button');
		fireEvent.click(buttonElement);

		expectText(/Please fill/);
		expect(validateAddress as any).not.toHaveBeenCalled();
	});

	it('shows a message', async () => {
		fillForm();

		expectText(/Loading…/);
		await waitFor(
			() => expectText(/The postcode 1234 does not match the suburb Melbourne./)
		);
		expect(validateAddress as any).toHaveBeenCalled();
	});

	it('updates the message only on validation', async () => {
		fillForm();
		await waitFor(
			() => expectText(/The postcode 1234/)
		);

		const postcodeInput = screen.getByLabelText(/Postcode/i);
		fireEvent.change(postcodeInput, { target: { value: '4567' } });
		expectText(/The postcode 1234/);
		expect(screen.queryByText(/The postcode 4567/)).toBeNull();
	});

	it('handles API errors', async () => {
		(validateAddress as any).mockImplementation(
			() => Promise.reject('some back-end error')
		);
		fillForm();

		await waitFor(
			() => expectText(/Something went wrong/)
		);
		expect(validateAddress as any).toHaveBeenCalled();
	});
});
