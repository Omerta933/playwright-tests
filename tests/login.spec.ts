import { test, expect } from '../fixtures';
import { ENV } from '../utils/env';

test.describe('The Internet — Login Page', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ─── Завантаження сторінки ───────────────────────────────────────────────

  test('повинна завантажитись сторінка логіну', async ({ page }) => {
    await expect(page).toHaveURL(/login/);
    await expect(page).toHaveTitle(/The Internet/i);
  });

  test('повинна відображатись форма логіну', async ({ loginPage }) => {
    await loginPage.assertVisible(loginPage.loginForm);
  });

  test('повинні відображатись поля username та password', async ({ loginPage }) => {
    await loginPage.assertVisible(loginPage.usernameInput);
    await loginPage.assertVisible(loginPage.passwordInput);
  });

  test('повинна відображатись кнопка Login', async ({ loginPage }) => {
    await loginPage.assertVisible(loginPage.submitButton);
  });

  // ─── Успішний вхід ───────────────────────────────────────────────────────

  test('успішний вхід з правильними даними', async ({ loginPage, page }) => {
    await loginPage.login(ENV.username, ENV.password);
    await expect(page).toHaveURL(/secure/);
  });

  test('після входу показується повідомлення про успіх', async ({ loginPage }) => {
    await loginPage.login(ENV.username, ENV.password);
    const message = await loginPage.getFlashMessage();
    expect(message).toContain('You logged into a secure area!');
  });

  test('після входу відображається кнопка Logout', async ({ loginPage, homePage, page }) => {
    await loginPage.login(ENV.username, ENV.password);
    await expect(page).toHaveURL(/secure/);
    await homePage.assertVisible(homePage.logoutButton);
  });

  // ─── Невдалий вхід ───────────────────────────────────────────────────────

  test('помилка при неправильному паролі', async ({ loginPage, page }) => {
    await loginPage.login(ENV.username, 'WrongPassword123!');
    await expect(page).toHaveURL(/login/);
    const message = await loginPage.getErrorMessage();
    expect(message).toContain('Your password is invalid!');
  });

  test('помилка при неправильному username', async ({ loginPage, page }) => {
    await loginPage.login('wronguser', ENV.password);
    await expect(page).toHaveURL(/login/);
    const message = await loginPage.getErrorMessage();
    expect(message).toContain('Your username is invalid!');
  });

  test('помилка при порожньому username', async ({ loginPage, page }) => {
    await loginPage.login('', ENV.password);
    await expect(page).toHaveURL(/login/);
    const message = await loginPage.getErrorMessage();
    expect(message.length).toBeGreaterThan(0);
  });

  test('помилка при порожньому паролі', async ({ loginPage, page }) => {
    await loginPage.login(ENV.username, '');
    await expect(page).toHaveURL(/login/);
    const message = await loginPage.getErrorMessage();
    expect(message.length).toBeGreaterThan(0);
  });

  test('помилка при порожніх обох полях', async ({ loginPage, page }) => {
    await loginPage.login('', '');
    await expect(page).toHaveURL(/login/);
    const message = await loginPage.getErrorMessage();
    expect(message.length).toBeGreaterThan(0);
  });

  // ─── Logout ──────────────────────────────────────────────────────────────

  test('успішний вихід після входу', async ({ loginPage, homePage, page }) => {
    await loginPage.login(ENV.username, ENV.password);
    await expect(page).toHaveURL(/secure/);
    await homePage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('після виходу показується повідомлення', async ({ loginPage, homePage }) => {
    await loginPage.login(ENV.username, ENV.password);
    await homePage.logout();
    const message = await loginPage.getFlashMessage();
    expect(message).toContain('You logged out of the secure area!');
  });

});
