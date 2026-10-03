import { NostalgicDiva } from '@/components/NostalgicDiva';
import {
	NostalgicDivaProvider,
	useNostalgicDiva,
} from '@/components/NostalgicDivaProvider';
import type { PlayerOptions } from '@/controllers/PlayerController';
import { type ReactElement, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { Harness, HarnessEvent } from './harness';

const events: HarnessEvent[] = [];
const push = (event: HarnessEvent): void => {
	events.push(event);
};

// Error payloads differ per platform (DOM events, plain objects, codes), so
// reduce them to something that survives `page.evaluate`.
function describeError(error: unknown): string {
	if (error instanceof Event) return `${error.type} event`;
	try {
		return JSON.stringify(error) ?? String(error);
	} catch {
		return String(error);
	}
}

// Must be stable: `PlayerContainer` re-attaches whenever `options` changes.
const options: PlayerOptions = {
	onError: (detail) => push({ type: 'error', detail: describeError(detail) }),
	onLoaded: (detail) => push({ type: 'loaded', detail }),
	onPlay: () => push({ type: 'play' }),
	onPause: () => push({ type: 'pause' }),
	onEnded: () => push({ type: 'ended' }),
	onTimeUpdate: (detail) => push({ type: 'timeupdate', detail }),
};

window.harness = {
	events,
	controllerChanges: 0,
} as unknown as Harness;

const handleControllerChange = (): void => {
	window.harness.controllerChanges++;
};

function Bridge(): null {
	const diva = useNostalgicDiva();
	useEffect(() => {
		window.harness.diva = diva;
	}, [diva]);
	return null;
}

function App(): ReactElement {
	const [src, setSrc] = useState(
		new URLSearchParams(location.search).get('src') ?? '',
	);

	useEffect(() => {
		window.harness.setSrc = setSrc;
	}, []);

	return (
		<NostalgicDivaProvider>
			<Bridge />
			<div style={{ width: 640, height: 360 }}>
				<NostalgicDiva
					src={src}
					options={options}
					onControllerChange={handleControllerChange}
				/>
			</div>
		</NostalgicDivaProvider>
	);
}

createRoot(document.getElementById('root')!).render(<App />);
