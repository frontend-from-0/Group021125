import {test, expect} from '@playwright/test';


test.describe('Admin - Product pages', () => {
  test('logged out user should not be able to access admin product page', async ({page}) => {
    await page.goto('/admin/products');

    await expect(page).not.toHaveURL('/admin/products');

    await expect(page.getByText('Log in to dev-jm5m0z3xkqxztipx to continue to Random Quotes 021125.')).toBeVisible();
    await expect(page.getByRole('textbox', {name: 'Email address'})).toBeVisible();
    await expect(page.getByRole('textbox', {name: 'Password'})).toBeVisible();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
  })
})