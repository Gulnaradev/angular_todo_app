import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo.page';

test.describe('Todo — Filters / Edge / Input Validation', () => {
  test('Active shows only active tasks', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const active = `active-${Date.now()}`;
    const completed = `completed-${Date.now()}`;

    await todo.add(active);
    await todo.add(completed);
    await todo.toggle(completed); 

    await todo.setFilter('Active');

    await expect(todo.itemByTitle(active)).toBeVisible();
    await expect(todo.itemByTitle(completed)).toHaveCount(0);
  });

  test('Completed shows only completed tasks', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const a = `a-${Date.now()}`;
    const c = `c-${Date.now()}`;

    await todo.add(a);
    await todo.add(c);
    await todo.toggle(c);

    await todo.setFilter('Completed');

    await expect(todo.itemByTitle(c)).toBeVisible();
    await expect(todo.itemByTitle(a)).toHaveCount(0);
  });

  test('All shows both active and completed tasks', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const t1 = `t1-${Date.now()}`;
    const t2 = `t2-${Date.now()}`;

    await todo.add(t1);
    await todo.add(t2);
    await todo.toggle(t2);

    await todo.setFilter('All');

    await expect(todo.itemByTitle(t1)).toBeVisible();
    await expect(todo.itemByTitle(t2)).toBeVisible();
  });

  test('added todo is not persisted after page reload', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const title = `temp-${Date.now()}`;

    await todo.add(title);
    await expect(todo.itemByTitle(title)).toBeVisible();

    await page.reload();

    // из-за ограничений JSONPlaceholder задача пропадает
    await expect(todo.itemByTitle(title)).toHaveCount(0);
  });
  
  test('should NOT add empty todo', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const before = await todo.items.count();
    await todo.input.fill('');
    await todo.input.press('Enter');

    await expect(todo.items).toHaveCount(before);
  });

  test('should NOT add whitespace-only todo', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const before = await todo.items.count();
    await todo.input.fill('     ');
    await todo.input.press('Enter');

    await expect(todo.items).toHaveCount(before);
  });

test('can add very long todo title (no crash)', async ({ page }) => {
  const todo = new TodoPage(page);
  await todo.goto();

  const longTitle = `L-${Date.now()}-` + 'x'.repeat(220); 

  await todo.add(longTitle);
  await expect(todo.itemByTitle(longTitle)).toBeVisible();
});

test('add multiple todos quickly (no lost items)', async ({ page }) => {
  const todo = new TodoPage(page);
  await todo.goto();

  const t1 = `t1-${Date.now()}`;
  const t2 = `t2-${Date.now()}`;
  const t3 = `t3-${Date.now()}`;

  await todo.add(t1);
  await todo.add(t2);
  await todo.add(t3);

  await expect(todo.itemByTitle(t1)).toBeVisible();
  await expect(todo.itemByTitle(t2)).toBeVisible();
  await expect(todo.itemByTitle(t3)).toBeVisible();
});

test('handles slow API response (<=2s) on initial load', async ({ page }) => {
  await page.route(/jsonplaceholder\.typicode\.com\/todos/i, async (route) => {
    const req = route.request();
    if (req.method().toUpperCase() === 'GET') {
      await new Promise(r => setTimeout(r, 1900));
      return route.continue();
    }
    return route.continue();
  });

  const todo = new TodoPage(page);
  await todo.goto();

  // Просто убеждаемся, что UI живой и список появился
  await expect(todo.items.first()).toBeVisible({ timeout: 8000 });
});
});
