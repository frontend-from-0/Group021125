import {test, expect} from '@playwright/test';


test.describe('Profile', () => {
  test('logged out user should not be able to access user profile page', async ({page}) => {
    await page.goto('/profile');

    await expect(page).not.toHaveURL('/profile');


    await expect(page.getByText('Log in to dev-jm5m0z3xkqxztipx to continue to Random Quotes 021125.')).toBeVisible();
    await expect(page.getByRole('textbox', {name: 'Email address'})).toBeVisible();
    await expect(page.getByRole('textbox', {name: 'Password'})).toBeVisible();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
  })
})