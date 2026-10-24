import { test, expect } from '@playwright/test';

test('home page shows Kelasi branding', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.app-header__title')).toHaveText('Kelasi');
  await expect(page.locator('.app-header__logo')).toBeVisible();
});

test('navigation links are in French', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Tableau de bord')).toBeVisible();
  await expect(page.getByText('Élèves')).toBeVisible();
  await expect(page.getByText('Frais')).toBeVisible();
  await expect(page.getByText('Notes')).toBeVisible();
});
