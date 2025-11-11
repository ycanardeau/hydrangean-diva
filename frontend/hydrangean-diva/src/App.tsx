import '@/icons';

import { NostalgicDivaProvider } from '@aigamo/nostalgic-diva';
import { EuiProvider } from '@elastic/eui';
import createCache from '@emotion/cache';
import {
	createHashHistory,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { ReactElement, ReactNode } from 'react';

import { Compose } from '@/features/common/components/Compose';
import { PlayQueueStoreProvider } from '@/features/media-player.play-queue/components/PlayQueueStoreContext';
import { PlayerStoreProvider } from '@/features/media-player.player/components/PlayerStoreContext';
import { routeTree } from '@/routeTree.gen';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const hashHistory = createHashHistory();

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
	history: hashHistory,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

interface AppProviderProps {
	children?: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps): ReactElement => {
	return (
		<EuiProvider colorMode="dark" cache={euiCache}>
			{children}
		</EuiProvider>
	);
};

const App = (): ReactElement => {
	return (
		<Compose
			components={[
				AppProvider,
				NostalgicDivaProvider,
				PlayerStoreProvider,
				PlayQueueStoreProvider,
			]}
		>
			<RouterProvider router={router} />
		</Compose>
	);
};

export default App;
