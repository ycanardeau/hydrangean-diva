import { expect, test } from '@playwright/test';

import {
	clearEvents,
	currentTime,
	eventTypes,
	events,
	expectEvent,
	open,
	waitForController,
} from './helpers';

// Served by the e2e Vite server (see vite.config.e2e.ts).
const SHORT = 'short.wav'; // 1.5 s
const LONG = 'long.wav'; // 30 s

function url(baseURL: string | undefined, file: string): string {
	return new URL(file, baseURL).toString();
}

test.describe('Audio', () => {
	test('renders an <audio> element and attaches a controller', async ({
		page,
		baseURL,
	}) => {
		const src = url(baseURL, LONG);
		await open(page, src);
		await waitForController(page);

		await expect(page.locator('audio')).toHaveAttribute('src', src);
		expect(
			await page.evaluate(() => window.harness.diva.getDuration()),
		).toBeCloseTo(30, 0);
	});

	test('autoplays and reports progress', async ({ page, baseURL }) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);

		await expect.poll(() => currentTime(page)).toBeGreaterThan(0.3);
		await expectEvent(page, 'timeupdate');
		// The element starts loading (and autoplaying) before the controller
		// attaches, so make sure the initial events are not missed.
		expect(await eventTypes(page)).toEqual(
			expect.arrayContaining(['loaded', 'play']),
		);

		const update = (await events(page))
			.filter((event) => event.type === 'timeupdate')
			.at(-1)!.detail as {
			duration: number;
			percent: number;
			seconds: number;
		};
		expect(update.duration).toBeCloseTo(30, 0);
		expect(update.percent).toBeCloseTo(update.seconds / update.duration);
	});

	test('pauses and resumes', async ({ page, baseURL }) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);
		await expect.poll(() => currentTime(page)).toBeGreaterThan(0);
		await clearEvents(page);

		await page.evaluate(() => window.harness.diva.pause());
		await expectEvent(page, 'pause');
		const pausedAt = await currentTime(page);
		await page.waitForTimeout(500);
		expect(await currentTime(page)).toBe(pausedAt);

		await page.evaluate(() => window.harness.diva.play());
		await expectEvent(page, 'play');
		await expect.poll(() => currentTime(page)).toBeGreaterThan(pausedAt);
	});

	test('seeks and resumes playback', async ({ page, baseURL }) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);
		await page.evaluate(() => window.harness.diva.pause());

		await page.evaluate(() => window.harness.diva.setCurrentTime(20));

		expect(await currentTime(page)).toBeGreaterThanOrEqual(20);
		// The provider resumes playback after seeking.
		await expect.poll(() => currentTime(page)).toBeGreaterThan(20.2);
	});

	test('sets volume, muted and playback rate', async ({ page, baseURL }) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);

		const result = await page.evaluate(async () => {
			const { diva } = window.harness;
			await diva.setVolume(0.25);
			await diva.setMuted(true);
			await diva.setPlaybackRate(1.5);
			return {
				volume: await diva.getVolume(),
				muted: await diva.getMuted(),
				playbackRate: await diva.getPlaybackRate(),
			};
		});

		expect(result).toEqual({
			volume: 0.25,
			muted: true,
			playbackRate: 1.5,
		});
		const audio = page.locator('audio');
		expect(await audio.evaluate((a: HTMLAudioElement) => a.volume)).toBe(
			0.25,
		);
		expect(await audio.evaluate((a: HTMLAudioElement) => a.muted)).toBe(
			true,
		);
	});

	test('reports ended', async ({ page, baseURL }) => {
		await open(page, url(baseURL, SHORT));
		await waitForController(page);

		await expectEvent(page, 'ended');
	});

	test('loads a new source into the same element when src changes', async ({
		page,
		baseURL,
	}) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);
		const handle = await page.locator('audio').elementHandle();
		await clearEvents(page);

		const next = url(baseURL, SHORT);
		await page.evaluate((src) => window.harness.setSrc(src), next);

		await expect(page.locator('audio')).toHaveJSProperty('src', next);
		expect(
			await handle!.evaluate((a) => a.isConnected),
			'element should be reused',
		).toBe(true);
		await expect
			.poll(async () =>
				(await events(page)).filter((e) => e.type === 'loaded'),
			)
			.toContainEqual({ type: 'loaded', detail: { id: next } });
		await expect
			.poll(() => page.evaluate(() => window.harness.diva.getDuration()))
			.toBeCloseTo(1.5, 1);
	});

	test('falls back to an empty player for an unplayable src', async ({
		page,
		baseURL,
	}) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);

		await page.evaluate(() =>
			window.harness.setSrc('https://example.com/not-a-video'),
		);

		await expect(page.locator('audio')).toHaveCount(0);
		await expect(page.locator('iframe')).toHaveAttribute(
			'src',
			'about:blank',
		);
		await expect
			.poll(() =>
				page.evaluate(() => window.harness.diva.supports('play')),
			)
			.toBe(false);
		// Commands are harmless no-ops while nothing is attached.
		await page.evaluate(() => window.harness.diva.play());
	});

	test('recovers after switching away and back', async ({
		page,
		baseURL,
	}) => {
		await open(page, url(baseURL, LONG));
		await waitForController(page);

		await page.evaluate(() => window.harness.setSrc(''));
		await expect(page.locator('audio')).toHaveCount(0);

		await page.evaluate(
			(src) => window.harness.setSrc(src),
			url(baseURL, LONG),
		);
		await waitForController(page);
		await clearEvents(page);

		await page.evaluate(() => window.harness.diva.setCurrentTime(10));
		await expect.poll(() => currentTime(page)).toBeGreaterThan(10);
		expect(await eventTypes(page)).toContain('timeupdate');
	});
});

test.describe('<nostalgic-diva> web component', () => {
	test('plays audio and dispatches DOM events', async ({ page, baseURL }) => {
		await page.goto(
			`/web-component.html?src=${encodeURIComponent(url(baseURL, SHORT))}`,
		);

		await page.waitForFunction(
			() => (window as any).element.supports('play'),
			{ timeout: 15_000 },
		);
		await expect
			.poll(() => page.evaluate(() => (window as any).elementEvents))
			.toContain('ended');
		expect(
			await page.evaluate(() => (window as any).element.getDuration()),
		).toBeCloseTo(1.5, 1);
	});
});
