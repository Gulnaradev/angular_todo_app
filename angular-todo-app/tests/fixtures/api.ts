import { Page } from '@playwright/test';
import type { TodoSeedItem } from './test-data';

const API_RE = /jsonplaceholder\.typicode\.com\/todos/i;

export async function mockTodosGet(page: Page, seed: TodoSeedItem[]) {
  await page.route(API_RE, async (route) => {
    const req = route.request();
    if (req.method().toUpperCase() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(seed),
      });
    }
    return route.continue();
  });
}
