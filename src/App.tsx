import {
	PlayerStoreProvider,
	usePlayerStore,
} from '@/components/PlayerStoreContext';
import {
	NostalgicDiva,
	NostalgicDivaProvider,
	PlayerOptions,
	PlayerType,
	useNostalgicDiva,
} from '@aigamo/nostalgic-diva';
import { EuiBottomBar, EuiButton, EuiProvider, EuiRange } from '@elastic/eui';
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

const videoServiceIcons: Record<PlayerType, string | undefined> = {
	Audio: '',
	Niconico: 'https://www.nicovideo.jp/favicon.ico',
	SoundCloud: '',
	Vimeo: '',
	YouTube: 'https://www.youtube.com/favicon.ico',
};

const BottomBar = (): React.ReactElement => {
	const [value, setValue] = React.useState('');

	return (
		<EuiBottomBar>
			<EuiRange
				min={0}
				max={100}
				value={value}
				onChange={(e): void => setValue(e.currentTarget.value)}
				fullWidth
				showRange
			/>
		</EuiBottomBar>
	);
};

const AppContainer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	const nostalgicDiva = useNostalgicDiva();

	const options = React.useMemo(
		(): PlayerOptions => ({
			onPlay: () => playerStore.onPlay(),
			onPause: () => playerStore.onPause(),
			onEnded: () => playerStore.onEnded(),
		}),
		[playerStore],
	);

	React.useEffect(() => {
		return reaction(
			() => playerStore.currentItem,
			() => playerStore.setPlaying(false),
		);
	}, [playerStore]);

	return (
		<>
			<div>
				{playerStore.items.map((item, index) => (
					<React.Fragment key={index}>
						<EuiButton
							iconType={videoServiceIcons[item.type]}
							onClick={(): void =>
								playerStore.setCurrentItem(item)
							}
						>
							{item.title}
						</EuiButton>
					</React.Fragment>
				))}
				<EuiButton
					onClick={(): void => playerStore.setCurrentItem(undefined)}
				>
					Clear{/* LOC */}
				</EuiButton>
			</div>

			{playerStore.currentItem && (
				<NostalgicDiva
					type={playerStore.currentItem.type}
					videoId={playerStore.currentItem.videoId}
					options={options}
				/>
			)}

			<div>
				{playerStore.playing ? (
					<EuiButton
						onClick={(): Promise<void> => nostalgicDiva.pause()}
						disabled={!playerStore.canPause}
					>
						Pause{/* LOC */}
					</EuiButton>
				) : (
					<EuiButton
						onClick={(): Promise<void> => nostalgicDiva.play()}
						disabled={!playerStore.canPlay}
					>
						Play{/* LOC */}
					</EuiButton>
				)}
			</div>

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
