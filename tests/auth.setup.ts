import { test as setup } from './utils/fixtures';
import { AUTH_USERS, PASSWORD, authFile } from './utils/auth';

// Log in once per user and save the session for reuse across the run
for (const username of AUTH_USERS) {
  setup(`authenticate ${username}`, async ({ page, swagLabs }) => {
    await swagLabs.login(username, PASSWORD);
    await page.waitForURL(/inventory\.html/);
    await page.context().storageState({ path: authFile(username) });
  });
}
