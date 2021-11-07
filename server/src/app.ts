// Server app entry point
// Sets up and starts an Express server

import express from 'express';
import { validateAddress } from './address-validation/address-validation-service';

const HTTP_PORT = 8000;

const app = express();

// Treat query params as raw strings, since we never send structured data.
app.set('query parser', 'simple');

// If there were more routes, this would be moved to a separate controller.
app.get('/validate-address', async (req, res) => {
	const { suburb, postcode, state } = req.query;
	const validationResult = await validateAddress({
		suburb: suburb as string,
		postcode: postcode as string,
		state: state as string
	});

	// Set the status code
	// Treat "this address is invalid" as a success, since the validation operation succeeded;
	// if the client is expected to only send valid addresses, 400 could make more sense.
	const { status } = validationResult;
	console.debug('Validation result:', status);
	const statusCode = status === 'error' ? 503 : 200;

	res.status(statusCode).json(validationResult);
});

// For production use, I'd also add a healthcheck route.

app.listen(HTTP_PORT, () => {
	console.log(`Express server listening on http://localhost:${HTTP_PORT}/`);
});
