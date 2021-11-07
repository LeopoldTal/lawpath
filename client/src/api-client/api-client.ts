// Client for our back-end API

import { getApiUrl } from '../config/config-service';
import { Address } from '../models/address';
import { ValidationStatus } from '../models/validation';

type ValidateAddressResponse = {
	status: ValidationStatus;
};

// Get the validation status
// Could test by mocking `fetch`, but that's not a very useful test; use e2e tests instead
export const validateAddress = ({
	postcode,
	suburb,
	state
}: Address): Promise<ValidateAddressResponse> => {
	const baseUrl = getApiUrl();

	const url = `${baseUrl}/validate-address?postcode=${postcode}&suburb=${suburb}&state=${state}`;
	return fetch(url).then(res => res.json());
};
