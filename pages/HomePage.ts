import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading = this.page.locator('h2, h1').first();
  readonly flashMessage = this.page.locator('#flash');
  readonly logoutButton = this.page.locator('a[href="/logout"]');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async gotoSecure() {
    await this.navigate('/secure');
    await this.waitForPageLoad();
  }

  async getHeadingText(): Promise<string> {
    return this.heading.innerText();
  }

  async getNavLinkCount(): Promise<number> {
    return this.page.locator('nav a, ul li a').count();
  }

  async clickNavLink(text: string) {
    await this.page.locator(`a:has-text("${text}")`).click();
  }

  async logout() {
    await this.clickElement(this.logoutButton);
    await this.waitForPageLoad();
  }

  async getFlashMessage(): Promise<string> {
    await this.flashMessage.waitFor({ state: 'visible', timeout: 5000 });
    return this.flashMessage.innerText();
  }
}
