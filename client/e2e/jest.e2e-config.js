const ts_preset = require('ts-jest/jest-preset');
const puppeteer_preset = require('jest-puppeteer/jest-preset');

module.exports = {
	rootDir: '..',
	roots: ['./e2e', './src'],
	globalSetup: 'jest-environment-puppeteer/setup',
	globalTeardown: 'jest-environment-puppeteer/teardown',
	testEnvironment: 'jest-environment-puppeteer',
	setupTestFrameworkScriptFile: 'expect-puppeteer',
	testMatch: ['**/?(*.)+(spec|test).[t]s'],
	transform: { '^.+\\.ts?$': 'ts-jest' },
	testTimeout: 60 * 1000 // requests are slow, allow plenty of time
};
