import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GooglePage extends BasePage {
  // Use ARIA/accessible locators — more resilient to HTML changes
  readonly searchInput = this.page.getByRole('combobox', { name: 'Search' });
  readonly searchButton = this.page.getByRole('button', { name: 'Google Search' });
  readonly logo = this.page.getByRole('img', { name: 'Google' });

  // Results area
  private readonly resultsContainer = this.page.locator('#rso');
  private readonly resultHeadings = this.page.locator('#rso h3');
  private readonly resultStats = this.page.locator('#result-stats');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('https://www.google.com');
    await this.waitForPageLoad();
    // Dismiss cookie/consent banner if present
    const acceptBtn = this.page.getByRole('button', { name: /Accept all|I agree/i }).first();
    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptBtn.click();
    }
  }

  async search(query: string) {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isBlockedByCaptcha(): Promise<boolean> {
    return this.page.url().includes('/sorry');
  }

  async getResultCount(): Promise<number> {
    await this.resultsContainer.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return this.resultHeadings.count();
  }

  async getResultTitles(): Promise<string[]> {
    await this.resultHeadings.first().waitFor({ state: 'visible', timeout: 10000 });
    return this.resultHeadings.allInnerTexts();
  }

  async isLogoVisible(): Promise<boolean> {
    return this.logo.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getResultStats(): Promise<string> {
    await this.resultStats.waitFor({ state: 'visible', timeout: 5000 });
    return this.resultStats.innerText();
  }
}
