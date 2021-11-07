/**
 * @jest-environment puppeteer
 */

import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';

const PAGE_URL = 'http://localhost:3000/';

const BROWSER_SETTINGS = {
	dumpio: true,
	// Enable these settings to watch Chromium run the tests
	headless: false,
	slowMo: 300,
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

	// TODO: address that exists

	// TODO: wrong postcode

	// TODO: wrong state
});
