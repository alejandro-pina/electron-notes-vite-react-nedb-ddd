import type { PlaywrightTestConfig } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
//Optional properties of the component, if anyrequire('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: "./e2e",
	
	timeout: 30 * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	
	fullyParallel: true,
	
	forbidOnly: !!process.env.CI,
	
	retries: process.env.CI ? 2 : 0,
	
	workers: process.env.CI ? 1 : undefined,
	
	reporter: "html",
	
	use: {
		
		actionTimeout: 0,
		
		//Optional properties of the component, if anybaseURL: 'http://localhost:3000',

		
		trace: "on-first-retry",
	},

	
	//Optional properties of the component, if anyoutputDir: 'test-results/',

	
	//Optional properties of the component, if anywebServer: {
	//Optional properties of the component, if any  command: 'npm run start',
	//Optional properties of the component, if any  port: 3000,
	//Optional properties of the component, if any},
};

export default config;
