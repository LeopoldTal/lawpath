// An Australian address
export type Address = {
	postcode: string;
	suburb: string;
	state: AustralianState;
};

// All states
// It might be nice to show the full names instead of, or as well as, the abbreviations.
export enum AustralianState {
	ACT = 'ACT',
	NSW = 'NSW',
	NT = 'NT',
	QLD = 'QLD',
	SA = 'SA',
	TAS = 'TAS',
	VIC = 'VIC',
	WA = 'WA'
};
