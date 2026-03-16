import { test, expect } from '../fixtures';
import { ENV } from '../utils/env';

test.describe('The Internet — Secure Area (Home)', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(ENV.username, ENV.password);
  });

  test('повинна відкритись захищена сторінка після входу', async ({ page }) => {
    await expect(page).toHaveURL(/secure/);
  });

  test('повинен відображатись заголовок сторінки', async ({ homePage }) => {
    const heading = await homePage.getHeadingText();
    expect(heading.length).toBeGreaterThan(0);
  });

  test('повинна відображатись кнопка Logout', async ({ homePage }) => {
    await homePage.assertVisible(homePage.logoutButton);
  });

  test('пряме відкриття /secure без входу перенаправляє на /login', async ({ page }) => {
    // Новий браузерний контекст — без сесії
    await page.context().clearCookies();
    await page.goto('/secure');
    await expect(page).toHaveURL(/login/);
  });

});
