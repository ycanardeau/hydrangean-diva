import { BottomBar } from '@/components/BottomBar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import {
	PlayerStoreProvider,
	usePlayerStore,
} from '@/components/PlayerStoreContext';
import { NostalgicDivaProvider } from '@aigamo/nostalgic-diva';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const AppContainer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	React.useEffect(() => {
		return reaction(
			() => playerStore.currentItem,
			() => playerStore.setPlaying(false),
		);
	}, [playerStore]);

	return (
		<>
			<PlayQueueTable />

			{!playerStore.isEmpty && <MiniPlayer />}

			<BottomBar />
		</>
	);
});

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
