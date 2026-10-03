import { type Page, expect, test } from '@playwright/test';

import {
	clearEvents,
	currentTime,
	eventTypes,
	events,
	expectEvent,
	open,
	waitForController,
} from './helpers';

// These tests embed the real third-party players, so they need internet
// access and can break when a platform changes its embed or removes a video.
// Run them with `pnpm test:e2e:network`.

test.describe.configure({ timeout: 90_000 });

// Embeds drop commands sent before they are ready, so (like a real host)
// wait for `onLoaded` before driving playback.
async function expectLoaded(page: Page, id: string): Promise<void> {
	await expect
		.poll(async () => (await events(page)).map((e) => e.detail), {
			timeout: 30_000,
		})
		.toContainEqual({ id });
}

async function startMuted(page: Page): Promise<void> {
	await page.evaluate(async () => {
		const { diva } = window.harness;
		if (diva.supports('setMuted')) await diva.setMuted(true);
		await diva.play();
	});
}

async function expectPlaybackControl(page: Page): Promise<void> {
	await startMuted(page);
	await expectEvent(page, 'play', 30_000);
	await expect
		.poll(() => currentTime(page), { timeout: 30_000 })
		.toBeGreaterThan(1);
	await expectEvent(page, 'timeupdate');

	await page.evaluate(() => window.harness.diva.pause());
	await expectEvent(page, 'pause');
	const pausedAt = await currentTime(page);
	await page.waitForTimeout(1500);
	expect(await currentTime(page)).toBeLessThan(pausedAt + 0.5);
}

const playable = [
	['YouTube', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw'],
	['Niconico', 'https://www.nicovideo.jp/watch/sm9', 'sm9'],
	[
		'SoundCloud',
		'https://soundcloud.com/forss/flickermood',
		'https://soundcloud.com/forss/flickermood',
	],
	[
		'Spotify',
		'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
		'spotify:track:4uLU6hMCjMI75M1A2tKUQC',
	],
] as const;

for (const [type, src, id] of playable) {
	test(`${type}: loads, plays and pauses`, async ({ page }) => {
		await open(page, src);
		await waitForController(page);

		await expectLoaded(page, id);

		await expectPlaybackControl(page);
		expect(await eventTypes(page)).not.toContain('error');
	});
}

// Vimeo attaches and reports metadata reliably, but playback in headless
// Chromium is not: `play()` sometimes errors and sometimes never settles.
test('Vimeo: loads and reports metadata', async ({ page }) => {
	await open(page, 'https://vimeo.com/76979871');
	await waitForController(page);

	await expectLoaded(page, '76979871');
	expect(
		await page.evaluate(() => window.harness.diva.getDuration()),
	).toBeGreaterThan(0);
	expect(
		await page.evaluate(() =>
			window.harness.diva.supports('setPlaybackRate'),
		),
	).toBe(true);
});

// Known issue: the legacy Dailymotion SDK (`api.dmcdn.net/all.js`) now logs
// "This integration method is deprecated" and never creates the player
// iframe, so nothing loads or plays.
test.fixme('Dailymotion: loads, plays and pauses', async ({ page }) => {
	await open(page, 'https://www.dailymotion.com/video/x7tgad0');
	await waitForController(page);

	await expect(page.locator('iframe')).toHaveCount(1);
	await expectEvent(page, 'loaded', 30_000);
	await expectPlaybackControl(page);
});

test('switching platforms hands control to the new player', async ({
	page,
}) => {
	await open(page, 'https://www.youtube.com/watch?v=jNQXAC9IVRw');
	await waitForController(page);
	expect(
		await page.evaluate(() =>
			window.harness.diva.supports('setPlaybackRate'),
		),
	).toBe(true);

	await clearEvents(page);

	await page.evaluate(() =>
		window.harness.setSrc('https://www.nicovideo.jp/watch/sm9'),
	);

	// Niconico does not support playback rate, so this flips once the
	// Niconico controller has replaced the YouTube one.
	await expect
		.poll(
			() =>
				page.evaluate(() =>
					window.harness.diva.supports('setPlaybackRate'),
				),
			{ timeout: 30_000 },
		)
		.toBe(false);
	await expect(page.locator('iframe[src*="embed.nicovideo.jp"]')).toHaveCount(
		1,
	);
	await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);

	await expectLoaded(page, 'sm9');
	await expectPlaybackControl(page);
});
