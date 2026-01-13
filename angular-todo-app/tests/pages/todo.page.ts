import { expect, Locator, Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;

  readonly input: Locator;
  readonly items: Locator;

  readonly filters: Locator;
  readonly filterButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.input = page.locator('input.task-input');
    this.items = page.locator('div.task-item');

    this.filters = page.locator('div.filters');
    this.filterButtons = this.filters.locator('button');
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.input).toBeVisible();
  }

  // ---------- item locators ----------
  itemByTitle(title: string): Locator {
    return this.items.filter({
      has: this.page.locator('.task-title', { hasText: title }),
    }).first();
  }

  checkbox(item: Locator): Locator {
    return item.locator('input.task-checkbox');
  }

  editButton(item: Locator): Locator {
    return item.locator('button.edit-button');
  }

  deleteButton(item: Locator): Locator {
    return item.locator('button.delete-button');
  }

  editInput(): Locator {
    return this.page.locator('div.task-edit input.edit-input');
  }

  saveButton(): Locator {
    return this.page.locator('div.task-edit button.save-button');
  }

  // ---------- actions ----------
  async add(title: string) {
    await this.input.fill(title);
    await this.input.press('Enter');
    await expect(this.itemByTitle(title)).toBeVisible({ timeout: 5000 });
  }

  async toggle(title: string) {
    const item = this.itemByTitle(title);
    await this.checkbox(item).click();
  }

  async remove(title: string) {
    const item = this.itemByTitle(title);
    await this.deleteButton(item).click();
    await expect(item).toHaveCount(0);
  }

async edit(oldTitle: string, newTitle: string) {
  const item = this.itemByTitle(oldTitle);
  await this.editButton(item).click();

  await expect(this.editInput()).toBeVisible({ timeout: 5000 });
  await this.editInput().fill(newTitle);
  await this.saveButton().click();

  await expect(this.itemByTitle(newTitle)).toBeVisible({ timeout: 5000 });
}

  // ---------- filters ----------
  async setFilter(name: 'All' | 'Active' | 'Completed') {
    await this.filterButtons.filter({ hasText: name }).click();
  }
}
