// Config reader

// base url of our API
export const getApiUrl = (): string => {
	const url = process.env.REACT_APP_API_URL;

	if (!url) {
		throw new Error(
			`Please set REACT_APP_API_URL in the .env file. Your env: ${JSON.stringify(process.env, null, 2)
			}`
		);
	}

	return url;
};
