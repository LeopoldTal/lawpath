import React from 'react';
import { render, screen } from '@testing-library/react';
import LawpathForm from './LawpathForm';

it('has a title', () => {
	render(<LawpathForm />);
	const titleElement = screen.getByText(/Validate an Australian address/);
	expect(titleElement).toBeInTheDocument();
});
