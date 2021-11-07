/**
 * @jest-environment puppeteer
 */

import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import { Address, AustralianState } from '../src/models/address';

const PAGE_URL = 'http://localhost:3000/';

const BROWSER_SETTINGS = {
	dumpio: true,
	// Enable these settings to watch Chromium run the tests
	// headless: false,
	// slowMo: 100,
	// devTools: true
};

describe('Lawpath form app', () => {
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		browser = await puppeteer.launch(BROWSER_SETTINGS);
		page = await browser.newPage();
	});

	afterAll(async () => {
		console.log('All tests done, closing the browser.');
		await browser.close();
	});

	it('shows the form', async () => {
		await page.goto(PAGE_URL);

		const form = await page.$('form');
		expect(form).toBeTruthy();
		const formText = await (form as ElementHandle).evaluate(e => e.textContent);

		expect(formText).toMatch(/Validate/i);
		expect(formText).toMatch(/Postcode/i);
		expect(formText).toMatch(/Suburb/i);
		expect(formText).toMatch(/State/i);
	});

	describe('address validation', () => {
		// expect(…).toFillForm is supposed to do this, but it fails silently…
		const validateAddress = async (
			page: Page,
			{ postcode, suburb, state }: Address
		) => {
			await page.type('input#postcode', postcode);
			await page.type('input#suburb', suburb);
			await page.select('select#ausState', state);

			await page.click('button[type="submit"]');

			return page.waitForResponse(res => res.status() === 200);
		};

		it('validates a correct address', async () => {
			await page.goto(PAGE_URL);
			await validateAddress(page, {
				postcode: '3095',
				suburb: 'Eltham',
				state: AustralianState.VIC
			});
			await page.waitForNetworkIdle();

			const message = await page.$('.message');
			expect(message).toBeTruthy();
			const messageText = await (message as ElementHandle).evaluate(e => e.textContent);
			expect(messageText).toMatch(/Eltham 3095 VIC is a valid address./);
		});

		it('reports a wrong postcode', async () => {
			await page.goto(PAGE_URL);
			await validateAddress(page, {
				postcode: '1234',
				suburb: 'North Melbourne',
				state: AustralianState.VIC
			});
			await page.waitForNetworkIdle();

			const message = await page.$('.message');
			expect(message).toBeTruthy();
			const messageText = await (message as ElementHandle).evaluate(e => e.textContent);
			expect(messageText).toMatch(/The postcode 1234 does not match the suburb North Melbourne./);
		});

		it('reports a wrong state', async () => {
			await page.goto(PAGE_URL);
			await validateAddress(page, {
				postcode: '3000',
				suburb: 'Melbourne',
				state: AustralianState.NSW
			});
			await page.waitForNetworkIdle();

			const message = await page.$('.message');
			expect(message).toBeTruthy();
			const messageText = await (message as ElementHandle).evaluate(e => e.textContent);
			expect(messageText).toMatch(/The suburb Melbourne does not exist in the state NSW./);
		});
	});
});
