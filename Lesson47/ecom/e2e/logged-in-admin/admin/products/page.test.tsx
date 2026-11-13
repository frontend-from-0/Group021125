import path from 'node:path';
import { test, expect } from '@playwright/test';

import { db } from '../../../../src/prisma/db';

const productImage = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'fixtures',
  'headphones.jpeg',
);

const testProduct = {
  name: 'Test laptop',
  description: 'Some description of the test laptop',
  category: 'ELECTRONICS',
  price: '1000',
  quantity: '10',
};

test.describe('Admin - Product pages', () => {
  test('logged in admin user should access admin products page', async ({
    page,
  }) => {
    await page.goto('/admin/products');

    await expect(page).toHaveURL('/admin/products');
    expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test.describe('create product', () => {
    test.afterEach(async () => {
      await db.orm.products.where({ name: testProduct.name }).deleteAndCount();
    });

    test.afterAll(async () => {
      await db.close();
    });

    test('logged in admin should be able to add a new product', async ({
      page,
    }) => {
      await page.goto('/admin/products');
      await page
        .getByRole('main')
        .getByRole('link', { name: 'Create product' })
        .click();
      await expect(page).toHaveURL('/admin/products/new');
      expect(page.getByRole('heading', { name: 'Create product' })).toBeVisible();

      await page.getByRole('textbox', { name: 'Name' }).fill(testProduct.name);
      await page
        .getByRole('textbox', { name: 'Description' })
        .fill(testProduct.description);
      await page.getByLabel('Category').selectOption(testProduct.category);
      await page.getByRole('textbox', { name: 'Price' }).fill(testProduct.price);
      await page
        .getByRole('spinbutton', { name: 'Stock' })
        .fill(testProduct.quantity);
      await page
        .getByRole('button', { name: 'Product images' })
        .setInputFiles(productImage);

      await page.getByRole('button', { name: 'Create product' }).click();

      await page.getByRole('link', { name: 'Products' }).click();
      await expect(page).toHaveURL('/admin/products');

      const productRow = page
        .getByRole('row')
        .filter({ hasText: testProduct.name });
      await expect(productRow).toBeVisible();
      await expect(
        productRow.getByRole('cell', { name: 'Electronics' }),
      ).toBeVisible();
      await expect(
        productRow.getByRole('cell', {
          name: testProduct.quantity,
          exact: true,
        }),
      ).toBeVisible();
    });
  });
});
