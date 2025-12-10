import { test, expect } from '@playwright/test';

test('Game loads and starts', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check title
    await expect(page).toHaveTitle(/Retro Space War/i);

    // Check for Start Button
    const startButton = page.getByRole('button', { name: /START GAME/i });
    await expect(startButton).toBeVisible();

    // Click Start
    await startButton.click();

    // Check if Start Button is gone (game started)
    await expect(startButton).not.toBeVisible();

    // Check HUD
    await expect(page.locator('#score')).toContainText('SCORE: 000000');
});

test('Pause functionality', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: /START GAME/i }).click();

    // Game is running
    // Press Escape
    await page.keyboard.press('Escape');

    // Check for Resume header or button
    await expect(page.getByRole('heading', { name: /PAUSED/i })).toBeVisible();

    // Resume
    await page.getByRole('button', { name: /RESUME/i }).click();
    await expect(page.getByRole('heading', { name: /PAUSED/i })).not.toBeVisible();
});
