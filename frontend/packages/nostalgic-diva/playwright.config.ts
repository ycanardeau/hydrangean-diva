import { defineConfig, devices } from '@playwright/test';

const port = 5179;

const browser = {
	...devices['Desktop Chrome'],
	launchOptions: {
		// Let the harness start playback without a user gesture.
		args: ['--autoplay-policy=no-user-gesture-required'],
	},
};

export default defineConfig({
	testDir: './e2e/tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${port}`,
		trace: 'retain-on-failure',
	},
	projects: [
		{
			// Self-contained: only talks to the local Vite server.
			name: 'chromium',
			testIgnore: '**/network.spec.ts',
			use: browser,
		},
		{
			// Embeds the real third-party players; needs internet access.
			name: 'network',
			testMatch: '**/network.spec.ts',
			use: browser,
		},
	],
	webServer: {
		command: `vite --config vite.config.e2e.ts --port ${port} --strictPort`,
		url: `http://localhost:${port}`,
		reuseExistingServer: !process.env.CI,
	},
});
