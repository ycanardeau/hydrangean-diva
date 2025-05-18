import { AppContainer } from '@/features/media-player/components/AppContainer';
import { PlayQueueStoreProvider } from '@/features/media-player/components/PlayQueueStoreContext';
import { PlayerStoreProvider } from '@/features/media-player/components/PlayerStoreContext';
import '@/icons';
import { NostalgicDivaProvider } from '@aigamo/nostalgic-diva';
import { EuiProvider } from '@elastic/eui';
import createCache from '@emotion/cache';
import React from 'react';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => {
	return (
		<EuiProvider colorMode="dark" cache={euiCache}>
			<PlayerStoreProvider>
				<PlayQueueStoreProvider>
					<NostalgicDivaProvider>
						<AppContainer />
					</NostalgicDivaProvider>
				</PlayQueueStoreProvider>
			</PlayerStoreProvider>
		</EuiProvider>
	);
};

export default App;
