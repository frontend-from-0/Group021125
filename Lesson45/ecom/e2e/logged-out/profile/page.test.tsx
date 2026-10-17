import { test, expect } from '@playwright/test';

test.describe('Profile', () => {
  test('logged out user should not be able to access user profule page', async ({
    page,
  }) => {
    await page.goto('/profile');
    // Testing that we are redirected to log in and do not access /profile page!!!
    await expect(page).not.toHaveURL('/profile');

    await expect(page.getByText('Log in to dev-')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Continue', exact: true }),
    ).toBeVisible();
  });
});
