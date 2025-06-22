import '@/icons';

import { NostalgicDivaProvider } from '@aigamo/nostalgic-diva';
import { EuiProvider } from '@elastic/eui';
import createCache from '@emotion/cache';
import { ReactElement, ReactNode } from 'react';

import { AppRoutes } from '@/AppRoutes';
import { Compose } from '@/common/components/Compose';
import { PlayerStoreProvider } from '@/features/media-player/components/PlayerStoreContext';
import { PlayQueueStoreProvider } from '@/features/media-player/components/PlayQueueStoreContext';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

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
			<AppRoutes />
		</Compose>
	);
};

export default App;
