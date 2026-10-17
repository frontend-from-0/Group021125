import { test, expect } from '@playwright/test';

test.describe('Admin - Product pages', () => {
  test('logged in admin user should able access admin products page', async ({
    page,
  }) => {
    await page.goto('/admin/products');

    await expect(page).toHaveURL('/admin/products');
  });
});
