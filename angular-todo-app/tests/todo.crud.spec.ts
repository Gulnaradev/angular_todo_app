import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo.page';

test.describe('Todo — CRUD basic', () => {
  test('create todo (Enter) -> appears in list', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const title = `task-${Date.now()}`;
    await todo.add(title);

    await expect(todo.itemByTitle(title)).toBeVisible();
  });

  test('toggle todo checkbox', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const title = `toggle-${Date.now()}`;
    await todo.add(title);

    await todo.toggle(title);

    const item = todo.itemByTitle(title);
    await expect(todo.checkbox(item)).toBeChecked();
  });

  test('delete todo', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const title = `delete-${Date.now()}`;
    await todo.add(title);

    await todo.remove(title);

    await expect(todo.itemByTitle(title)).toHaveCount(0);
  });

  test('edit todo and save', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    const oldTitle = `old-${Date.now()}`;
    const newTitle = `new-${Date.now()}`;

    await todo.add(oldTitle);
    await todo.edit(oldTitle, newTitle);

    await expect(todo.itemByTitle(newTitle)).toBeVisible();
  });
});
