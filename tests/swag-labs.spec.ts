import { test, expect } from './utils/fixtures';
import { PASSWORD, authFile } from './utils/auth';

test.describe('Swag Labs login', () => {
  test('should show 6 products after login with standard_user', async ({ page, swagLabs }) => {
    await swagLabs.login('standard_user', PASSWORD);

    // Verify landing on the inventory with 6 products
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(swagLabs.products).toHaveCount(6);
  });

  test('should show locked out error for locked_out_user', async ({ page, swagLabs }) => {
    await swagLabs.login('locked_out_user', PASSWORD);

    // Verify the error is shown and the user stays on the login page
    await expect(swagLabs.errorMessage).toContainText('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(swagLabs.products).toHaveCount(0);
  });
});

test.describe('Swag Labs cart', () => {
  // Start on the inventory already logged in
  test.use({ storageState: authFile('standard_user'), startPath: '/inventory.html' });

  test('should show 2 in the cart badge after adding two products', async ({ swagLabs }) => {
    // Verify the cart starts empty
    await expect(swagLabs.cartBadge).toHaveCount(0);

    // Add two products and verify the badge shows 2
    await swagLabs.addToCart('sauce-labs-backpack');
    await swagLabs.addToCart('sauce-labs-bike-light');
    await expect(swagLabs.cartBadge).toHaveText('2');
  });
});
