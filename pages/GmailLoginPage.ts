import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Сторінка входу в Gmail
export class GmailLoginPage extends BasePage {
  // Поле введення електронної пошти
  readonly emailInput = this.page.locator('input[type="email"]');
  // Поле введення пароля
  readonly passwordInput = this.page.locator('input[type="password"]');
  // Кнопка "Далі"
  readonly nextButton = this.page.getByRole('button', { name: 'Next' });
  // Повідомлення про помилку
  readonly errorMessage = this.page.locator('#yDmH0d .o6cuMc, [jsname="B34EJ"] span');
  // Посилання "Забули електронну пошту?"
  readonly forgotEmailLink = this.page.getByText('Forgot email?');
  // Посилання "Створити обліковий запис"
  readonly createAccountLink = this.page.getByText('Create account');
  // Заголовок сторінки
  readonly pageHeading = this.page.locator('h1');

  constructor(page: Page) {
    super(page);
  }

  // Перейти на сторінку входу в Gmail
  async goto() {
    await this.navigate('https://accounts.google.com/signin/v2/identifier?service=mail');
    await this.waitForPageLoad();
  }

  // Ввести електронну пошту та натиснути "Далі"
  async enterEmail(email: string) {
    await this.fillField(this.emailInput, email);
    await this.clickElement(this.nextButton);
    await this.waitForPageLoad();
  }

  // Ввести пароль та натиснути "Далі"
  async enterPassword(password: string) {
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.nextButton);
    await this.waitForPageLoad();
  }

  // Отримати текст повідомлення про помилку
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.first().waitFor({ state: 'visible', timeout: 5000 });
    return this.errorMessage.first().innerText();
  }

  // Перевірити, чи видиме поле пароля
  async isPasswordFieldVisible(): Promise<boolean> {
    return this.passwordInput.isVisible({ timeout: 5000 }).catch(() => false);
  }
}
