import express from 'express';

const HTTP_PORT = 8000;

const app = express();

// If there were more routes, this would be moved to a separate controller.
app.get('/validate-address', (req, res) => {
	// TODO
});

// For production use, I'd also add a healthcheck route.

app.listen(HTTP_PORT, () => {
	console.log(`Express server listening on http://localhost:${HTTP_PORT}/`);
});
