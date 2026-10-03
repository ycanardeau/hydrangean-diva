import type { useNostalgicDiva } from '@/components/NostalgicDivaProvider';

export interface HarnessEvent {
	type: 'error' | 'loaded' | 'play' | 'pause' | 'ended' | 'timeupdate';
	detail?: unknown;
}

// The page exposes this on `window` so Playwright can drive the player.
export interface Harness {
	diva: ReturnType<typeof useNostalgicDiva>;
	events: HarnessEvent[];
	controllerChanges: number;
	setSrc(src: string): void;
}

declare global {
	interface Window {
		harness: Harness;
	}
}
