import { type Page, expect } from '@playwright/test';

import type { HarnessEvent } from '../app/harness';

export async function open(page: Page, src: string): Promise<void> {
	await page.goto(`/?src=${encodeURIComponent(src)}`);
	await page.waitForFunction(() => window.harness?.diva !== undefined);
}

// Waits until the provider is wired to a real (attached) player controller.
export async function waitForController(page: Page): Promise<void> {
	await page.waitForFunction(() => window.harness.diva.supports('play'), {
		timeout: 30_000,
	});
}

export async function events(page: Page): Promise<HarnessEvent[]> {
	return page.evaluate(() => window.harness.events);
}

export async function eventTypes(page: Page): Promise<string[]> {
	return (await events(page)).map((event) => event.type);
}

export async function clearEvents(page: Page): Promise<void> {
	await page.evaluate(() => {
		window.harness.events.length = 0;
	});
}

export async function expectEvent(
	page: Page,
	type: HarnessEvent['type'],
	timeout = 15_000,
): Promise<void> {
	await expect.poll(() => eventTypes(page), { timeout }).toContain(type);
}

export async function currentTime(page: Page): Promise<number> {
	return page.evaluate(() => window.harness.diva.getCurrentTime());
}
