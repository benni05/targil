import { Page, Locator } from '@playwright/test';

export class SwagLabsPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly products: Locator;
  readonly errorMessage: Locator;
  readonly cartBadge: Locator;

  /**
   * Builds the page object and its locators.
   */
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.products = page.getByTestId('inventory-item');
    this.errorMessage = page.getByTestId('error');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  /**
   * Opens the given path, the login page by default.
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Logs in with the given credentials.
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Adds a product to the cart by its slug, e.g. "sauce-labs-backpack".
   */
  async addToCart(productSlug: string) {
    await this.page.getByTestId(`add-to-cart-${productSlug}`).click();
  }
}
