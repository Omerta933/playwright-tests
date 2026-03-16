import { Page } from '@playwright/test';

/** Wait for a network request matching a URL pattern */
export async function waitForRequest(page: Page, urlPattern: string | RegExp) {
  return page.waitForRequest(urlPattern);
}

/** Wait for a network response matching a URL pattern */
export async function waitForResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(urlPattern);
}

/** Generate a random string (useful for unique test data) */
export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/** Generate a random email */
export function randomEmail(domain = 'test.com'): string {
  return `user_${randomString()}@${domain}`;
}

/** Pause execution — use only for debugging, not in CI */
export async function debugPause(page: Page) {
  if (!process.env.CI) {
    await page.pause();
  }
}

/** Scroll element into view and click */
export async function scrollAndClick(page: Page, selector: string) {
  const el = page.locator(selector);
  await el.scrollIntoViewIfNeeded();
  await el.click();
}
