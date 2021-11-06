// Config reader
import 'dotenv/config';

type AusPostApiConfig = {
	ausPostApiUrl: string;
	ausPostApiKey: string;
};

export const getAusPostApiConfig = (): AusPostApiConfig => {
	const ausPostApiUrl = process.env.AUS_POST_API_URL;
	const ausPostApiKey = process.env.AUS_POST_API_KEY;

	if (!ausPostApiUrl || !ausPostApiKey) {
		throw new Error(
			`Please set AUS_POST_API_URL and AUS_POST_API_KEY in the .env file. Your env: ${JSON.stringify(process.env, null, 2)
			}`
		);
	}

	return { ausPostApiUrl, ausPostApiKey };
};
