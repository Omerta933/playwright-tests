import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.locator('#username');
  readonly passwordInput = this.page.locator('#password');
  readonly submitButton = this.page.locator('button[type="submit"]');
  readonly flashMessage = this.page.locator('#flash');
  readonly loginForm = this.page.locator('#login');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string) {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.submitButton);
    await this.waitForPageLoad();
  }

  async getFlashMessage(): Promise<string> {
    await this.flashMessage.waitFor({ state: 'visible', timeout: 5000 });
    return this.flashMessage.innerText();
  }

  async getErrorMessage(): Promise<string> {
    return this.getFlashMessage();
  }

  async isLoginFormVisible(): Promise<boolean> {
    return this.loginForm.isVisible({ timeout: 5000 }).catch(() => false);
  }
}
