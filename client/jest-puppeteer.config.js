// config for e2e tests
module.exports = {
	server: {
		command: 'npx serve -s build',
		port: 3000,
		launchTimeout: 30000,
		debug: true,
	}
};
