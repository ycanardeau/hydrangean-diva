import { Compose } from '@/features/common/components/Compose';
import { PlayQueueStoreProvider } from '@/features/media-player.play-queue/components/PlayQueueStoreProvider';
import { PlayerStoreProvider } from '@/features/media-player.player/components/PlayerStoreContext';
import '@/icons';
import { routeTree } from '@/routeTree.gen';
import { NostalgicDivaProvider } from '@aigamo/nostalgic-diva';
import { EuiProvider } from '@elastic/eui';
import createCache from '@emotion/cache';
import {
	RouterProvider,
	createHashHistory,
	createRouter,
} from '@tanstack/react-router';
import NProgress from 'nprogress';
import { ReactElement, ReactNode } from 'react';

import './nprogress.css';

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

NProgress.configure({ showSpinner: false });

// https://github.com/TanStack/router/discussions/549#discussioncomment-12855219
router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
	fromLocation && pathChanged && NProgress.start();
});
router.subscribe('onLoad', () => {
	NProgress.done();
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
