// An Australian address
export type Address = {
	postcode: string;
	suburb: string;
	state: string; // no need to force this to be a valid state, match logic suffices
};
