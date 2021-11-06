import fetchMock from 'jest-fetch-mock';
import { searchAddress } from './aus-post-client';

jest.mock('../config/config-service', () => ({
	getAusPostApiConfig: () => ({
		ausPostApiUrl: 'https://example.com',
		ausPostApiKey: 'test-api-key'
	})
}));

describe('searchAddress', () => {
	const mockResponseBody = (res: object) => fetchMock.mockResponse(JSON.stringify(res));

	beforeEach(fetchMock.resetMocks);

	describe('request', () => {
		it('looks up all 3 fields', async () => {
			const mocked = mockResponseBody({});
			await searchAddress({ postcode: '3000', suburb: 'Melbourne', state: 'VIC' });

			const expectedUrl = 'https://example.com/postcode/search.json?q=3000%20Melbourne&state=VIC';
			expect(mocked).toHaveBeenCalledWith(expectedUrl, expect.anything());
		});

		it('omits blank fields', async () => {
			const mocked = mockResponseBody({});
			await searchAddress({ suburb: 'Melbourne' });

			const expectedUrl = 'https://example.com/postcode/search.json?q=Melbourne';
			expect(mocked).toHaveBeenCalledWith(expectedUrl, expect.anything());
		});

		it('sends the auth key', async () => {
			const mocked = mockResponseBody({});
			await searchAddress({ suburb: 'Melbourne' });

			expect(mocked).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
				headers: expect.objectContaining({
					'Auth-Key': 'test-api-key'
				})
			}));
		});
	});

	describe('errors', () => {
		it('throws on rejected request', async () => {
			fetchMock.mockReject(new Error('generic failure'));
			expect(() => searchAddress({})).rejects.toThrow();
		});

		it('throws if the response describes an error', async () => {
			mockResponseBody({ error: 'Something went wrong' });
			expect(() => searchAddress({})).rejects.toThrow();
		});
	});

	describe('response parsing', () => {
		it('is empty when nothing is found', async () => {
			mockResponseBody({ localities: '' });
			const addresses = await searchAddress({});
			expect(addresses).toEqual([]);
		});

		it('lists all found addresses', async () => {
			mockResponseBody({
				localities: {
					locality: [
						{
							category: 'Delivery Area',
							id: 5356,
							latitude: -37.8133386,
							location: 'MELBOURNE',
							longitude: 144.9722006,
							postcode: 3000,
							state: 'VIC'
						},
						{
							location: 'TEST',
							postcode: 1234,
							state: 'TAS'
						}
					]
				}
			});
			const addresses = await searchAddress({});
			expect(addresses).toEqual([
				{ postcode: '3000', suburb: 'MELBOURNE', state: 'VIC' },
				{ postcode: '1234', suburb: 'TEST', state: 'TAS' }
			]);
		});
	});
});
