import { test as base, expect } from '@playwright/test';
import { SwagLabsPage } from '../pages/swag-labs.page';

/**
 * Extends the base test with a swagLabs page already opened at startPath, and an auto fixture that prints the test result, network errors (status >= 400 or failed requests)
 * and browser console errors after each test.
 */
export const test = base.extend<{ networkErrorLogger: void; swagLabs: SwagLabsPage; startPath: string }>({
  startPath: ['/', { option: true }],

  swagLabs: async ({ page, startPath }, use) => {
    const swagLabs = new SwagLabsPage(page);

    // Open the start path before the test runs
    await swagLabs.goto(startPath);
    await use(swagLabs);
  },

  networkErrorLogger: [
    async ({ page }, use, testInfo) => {
      const networkErrors: string[] = [];
      const consoleErrors: string[] = [];

      // Collect browser console errors and uncaught page exceptions
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(`${message.text()} (${message.location().url})`);
      });
      page.on('pageerror', (error) => consoleErrors.push(`Uncaught: ${error.message}`));

      // Collect network errors for the whole test
      page.on('response', (response) => {
        if (response.status() >= 400) networkErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
      });
      page.on('requestfailed', (request) => networkErrors.push(`FAILED ${request.method()} ${request.url()} - ${request.failure()?.errorText}`));

      await use();

      // Print the test result: green V on pass, red X on fail
      const passed = testInfo.status === testInfo.expectedStatus;
      console.log(passed ? `\x1b[32mV\x1b[0m ${testInfo.title}` : `\x1b[31mX\x1b[0m ${testInfo.title}`);

      // Print the collected errors after the test
      if (networkErrors.length) console.log(`Network errors in "${testInfo.title}":\n${networkErrors.join('\n')}`);

      // Print the collected console errors after the test
      if (consoleErrors.length) console.log(`Console errors in "${testInfo.title}":\n${consoleErrors.join('\n')}`);
    },
    { auto: true },
  ],
});

export { expect };
