import { type ReactElement, act } from 'react';
import { type Root, createRoot } from 'react-dom/client';

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

export interface RenderResult {
	container: HTMLElement;
	rerender(element: ReactElement): Promise<void>;
	unmount(): Promise<void>;
}

export async function render(element: ReactElement): Promise<RenderResult> {
	const container = document.createElement('div');
	document.body.appendChild(container);

	let root: Root;
	await act(async () => {
		root = createRoot(container);
		root.render(element);
	});

	return {
		container,
		rerender: async (element): Promise<void> => {
			await act(async () => root.render(element));
		},
		unmount: async (): Promise<void> => {
			await act(async () => root.unmount());
			container.remove();
		},
	};
}

// Flushes pending promises (and the React updates they trigger).
export async function flush(): Promise<void> {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}
