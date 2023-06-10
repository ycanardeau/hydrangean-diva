import { AppContainer } from '@/components/AppContainer';
import { PlayerStoreProvider } from '@/components/PlayerStoreContext';
import { NostalgicDivaProvider } from '@aigamo/nostalgic-diva';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
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
				<NostalgicDivaProvider>
					<AppContainer />
				</NostalgicDivaProvider>
			</PlayerStoreProvider>
		</EuiProvider>
	);
};

export default App;
