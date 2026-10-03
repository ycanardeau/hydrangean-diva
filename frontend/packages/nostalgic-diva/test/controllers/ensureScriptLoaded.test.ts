import type { ensureScriptLoaded as EnsureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import { getScript } from '@/controllers/getScript';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestLogger } from '../testLogger';

describe('getScript', () => {
	afterEach(() => {
		document.head.innerHTML = '';
	});

	function lastScript(): HTMLScriptElement {
		const scripts = document.head.querySelectorAll('script');
		return scripts[scripts.length - 1];
	}

	it('should append an async script and resolve on load', async () => {
		const promise = getScript('https://example.com/a.js');

		const script = lastScript();
		expect(script.src).toBe('https://example.com/a.js');
		expect(script.async).toBe(true);

		script.onload!(new Event('load'));
		await expect(promise).resolves.toBeUndefined();
		expect(script.onload).toBeNull();
	});

	it('should reject on error', async () => {
		const promise = getScript('https://example.com/b.js');
		const event = new Event('error');

		lastScript().onerror!(event);

		await expect(promise).rejects.toBe(event);
	});
});

describe('ensureScriptLoaded', () => {
	let ensureScriptLoaded: typeof EnsureScriptLoaded;
	let getScriptMock: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		// `ensureScriptLoaded` remembers loaded URLs in module state, so get a
		// fresh copy of the module for each test.
		vi.resetModules();
		getScriptMock = vi.fn().mockResolvedValue(undefined);
		vi.doMock('@/controllers/getScript', () => ({
			getScript: getScriptMock,
		}));
		({ ensureScriptLoaded } =
			await import('@/controllers/ensureScriptLoaded'));
	});

	afterEach(() => {
		vi.doUnmock('@/controllers/getScript');
	});

	it('should load a script once', async () => {
		const logger = createTestLogger();

		expect(await ensureScriptLoaded('https://a.example/x.js', logger)).toBe(
			true,
		);
		expect(await ensureScriptLoaded('https://a.example/x.js', logger)).toBe(
			false,
		);
		expect(getScriptMock).toHaveBeenCalledTimes(1);
	});

	it('should track URLs independently', async () => {
		const logger = createTestLogger();

		expect(await ensureScriptLoaded('https://a.example/x.js', logger)).toBe(
			true,
		);
		expect(await ensureScriptLoaded('https://a.example/y.js', logger)).toBe(
			true,
		);
	});

	it('should report exactly one first load for concurrent calls', async () => {
		const logger = createTestLogger();

		const results = await Promise.all([
			ensureScriptLoaded('https://a.example/x.js', logger),
			ensureScriptLoaded('https://a.example/x.js', logger),
		]);

		expect(results.filter((first) => first)).toHaveLength(1);
	});

	it('should rethrow and allow a retry after a failure', async () => {
		const logger = createTestLogger();
		const error = new Error('network');
		getScriptMock.mockRejectedValueOnce(error);

		await expect(
			ensureScriptLoaded('https://a.example/x.js', logger),
		).rejects.toBe(error);

		expect(await ensureScriptLoaded('https://a.example/x.js', logger)).toBe(
			true,
		);
	});
});
