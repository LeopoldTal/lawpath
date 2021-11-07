import { searchAddress } from '../aus-post-client/aus-post-client';
import { Address } from '../models/address';
import { matchAddressFields, validateAddress } from './address-validation-service';

jest.mock('../aus-post-client/aus-post-client', () => ({
	searchAddress: jest.fn()
}));

describe('validateAddress', () => {
	beforeEach(() => {
		(searchAddress as any).mockReturnValue([
			{
				postcode: '3095',
				suburb: 'Eltham',
				state: 'VIC'
			}
		]);
	});

	it('is valid if the address exists', async () => {
		const address = {
			postcode: '3095',
			suburb: 'Eltham',
			state: 'VIC'
		};
		const { status } = await validateAddress(address);
		expect(status).toBe('valid');
	});

	it('rejects blank fields', async () => {
		const address = {
			postcode: '',
			suburb: 'Eltham',
			state: 'VIC'
		};
		const { status } = await validateAddress(address);
		expect(status).toBe('missingRequiredFields');
	});

	it('detects mismatch between postcode and suburb', async () => {
		const address = {
			postcode: '3000',
			suburb: 'Eltham',
			state: 'VIC'
		};
		const { status } = await validateAddress(address);
		expect(status).toBe('postcodeSuburbMismatch');
	});

	it('detects mismatch between postcode and state', async () => {
		const address = {
			postcode: '3095',
			suburb: 'Eltham',
			state: 'NSW'
		};

		const { status } = await validateAddress(address);
		expect(status).toBe('suburbStateMismatch');
	});

	it('reports an error', async () => {
		(searchAddress as any).mockImplementation(() => {
			throw new Error('Auspost API failure');
		});

		const address = {
			postcode: '3095',
			suburb: 'Eltham',
			state: 'VIC'
		};
		const { status } = await validateAddress(address);
		expect(status).toBe('error');
	});
});

describe('matchAddressFields', () => {
	it('is false if there are no addresses', () => {
		const needle: Partial<Address> = {};
		const haystack: Address[] = [];
		expect(matchAddressFields(needle, haystack)).toBeFalsy();
	});

	it('is true if the specified fields match', () => {
		const needle: Partial<Address> = {
			postcode: '3000',
			state: 'VIC'
		};
		const haystack: Address[] = [
			{
				postcode: '3000',
				suburb: 'Melbourne',
				state: 'VIC'
			}
		];
		expect(matchAddressFields(needle, haystack)).toBeTruthy();
	});

	it('is false if any specified fields mismatch', () => {
		const needle: Partial<Address> = {
			postcode: '3000',
			suburb: 'Anywhere'
		};
		const haystack: Address[] = [
			{
				postcode: '3000',
				suburb: 'Melbourne',
				state: 'VIC'
			}
		];
		expect(matchAddressFields(needle, haystack)).toBeFalsy();
	});

	it('is true if any of the addresses match', () => {
		const needle: Partial<Address> = { postcode: '3000' };
		const noMatch: Address = {
			postcode: 'test',
			suburb: 'test',
			state: 'test',
		};
		const haystack: Address[] = [
			noMatch,
			{
				postcode: '3000',
				suburb: 'Melbourne',
				state: 'VIC'
			},
			noMatch
		];
		expect(matchAddressFields(needle, haystack)).toBeTruthy();
	});

	it('uses exact match', () => {
		const needle: Partial<Address> = { suburb: 'Melbourne' };
		const haystack: Address[] = [
			{
				postcode: '3000',
				suburb: 'North Melbourne',
				state: 'VIC'
			}
		];
		expect(matchAddressFields(needle, haystack)).toBeFalsy();
	});

	it('is case-insensitive', () => {
		const needle: Partial<Address> = {
			suburb: 'Melbourne',
			state: 'VIC'
		};
		const haystack: Address[] = [
			{
				postcode: '3000',
				suburb: 'MELBOURNE',
				state: 'vic'
			}
		];
		expect(matchAddressFields(needle, haystack)).toBeTruthy();
	});

	it('ignores blank fields', () => {
		const needle: Partial<Address> = {
			suburb: '',
			state: 'VIC'
		};
		const haystack: Address[] = [
			{
				postcode: '3000',
				suburb: 'MELBOURNE',
				state: 'VIC'
			}
		];
		expect(matchAddressFields(needle, haystack)).toBeTruthy();
	});
});
