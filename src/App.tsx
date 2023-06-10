import { PlayQueueTable } from '@/components/PlayQueueTable';
import {
	PlayerStoreProvider,
	usePlayerStore,
} from '@/components/PlayerStoreContext';
import {
	NostalgicDiva,
	NostalgicDivaProvider,
	PlayerOptions,
	useNostalgicDiva,
} from '@aigamo/nostalgic-diva';
import { EuiBottomBar, EuiProvider, EuiRange } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
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

const miniPlayerWidth = 16 * 25;
const miniPlayerHeight = 9 * 25;

const bottomBarHeight = 72;

const MiniPlayer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	const options = React.useMemo(
		(): PlayerOptions => ({
			onPlay: () => playerStore.onPlay(),
			onPause: () => playerStore.onPause(),
			onEnded: () => playerStore.onEnded(),
			onTimeUpdate: (e) => playerStore.onTimeUpdate(e),
		}),
		[playerStore],
	);

	return (
		<div
			css={{
				position: 'fixed',
				right: 0,
				bottom: bottomBarHeight,
				width: miniPlayerWidth,
				height: miniPlayerHeight,
				zIndex: 998,
				backgroundColor: 'rgb(39, 39, 39)',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div css={{ flexGrow: 1, backgroundColor: 'black' }}>
				{playerStore.currentItem && (
					<NostalgicDiva
						type={playerStore.currentItem.type}
						videoId={playerStore.currentItem.videoId}
						options={options}
					/>
				)}
			</div>
		</div>
	);
});

const SeekBar = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();
	const diva = useNostalgicDiva();

	const handleChange = React.useCallback(
		(e: _SingleRangeChangeEvent) => {
			const percent = Number(e.currentTarget.value) / 100;
			playerStore.setPercent(percent);
		},
		[playerStore],
	);

	const handleMouseDown = React.useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			if (e.button === 0) {
				playerStore.setSeeking(true);
			}
		},
		[playerStore],
	);

	const handleMouseUp = React.useCallback(
		async (e: React.MouseEvent<HTMLInputElement>) => {
			if (e.button === 0) {
				const percent = Number(e.currentTarget.value) / 100;

				playerStore.setSeeking(false);

				const duration = await diva.getDuration();
				if (duration !== undefined) {
					diva.setCurrentTime(duration * percent);
				}
			}
		},
		[playerStore, diva],
	);

	return (
		<EuiRange
			min={0}
			max={100}
			step={0.0000001}
			value={playerStore.percent * 100}
			onChange={handleChange}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			fullWidth
			showRange
		/>
	);
});

const BottomBar = (): React.ReactElement => {
	return (
		<EuiBottomBar>
			<SeekBar />
		</EuiBottomBar>
	);
};

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
