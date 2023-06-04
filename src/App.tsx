import {
	PlayerStoreProvider,
	usePlayerStore,
} from '@/components/PlayerStoreContext';
import { Video } from '@/stores/PlayerStore';
import {
	NostalgicDiva,
	NostalgicDivaProvider,
	PlayerOptions,
	PlayerType,
	useNostalgicDiva,
} from '@aigamo/nostalgic-diva';
import { EuiButton, EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
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

const videos: Video[] = [
	{ type: 'YouTube', videoId: 'bGdtvUQ9OAs', title: 'nostalgic diva' },
	{ type: 'Niconico', videoId: 'sm26653696', title: 'nostalgic diva' },
	{ type: 'Niconico', videoId: 'sm23384530', title: 'The Wind-Up Diva' },
	{ type: 'YouTube', videoId: 'jUe7dDLGpv8', title: 'Hydrangean Diva' },
	{ type: 'Niconico', videoId: 'sm24890523', title: 'Hydrangean Diva' },
];

const AppContainer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	const nostalgicDiva = useNostalgicDiva();

	const options = React.useMemo(
		(): PlayerOptions => ({
			onPlay: () => playerStore.onPlay(),
			onPause: () => playerStore.onPause(),
		}),
		[playerStore],
	);

	return (
		<>
			<div>
				{videos.map((video, index) => (
					<React.Fragment key={index}>
						<EuiButton
							iconType={videoServiceIcons[video.type]}
							onClick={(): void =>
								playerStore.setCurrentVideo(video)
							}
						>
							{video.title}
						</EuiButton>
					</React.Fragment>
				))}
				<EuiButton
					onClick={(): void => playerStore.clearCurrentVideo()}
				>
					Clear{/* LOC */}
				</EuiButton>
			</div>

			{playerStore.currentVideo && (
				<NostalgicDiva
					type={playerStore.currentVideo.type}
					videoId={playerStore.currentVideo.videoId}
					options={options}
				/>
			)}

			<div>
				{playerStore.playing ? (
					<EuiButton
						onClick={(): Promise<void> => nostalgicDiva.pause()}
						disabled={playerStore.currentVideo === undefined}
					>
						Pause
					</EuiButton>
				) : (
					<EuiButton
						onClick={(): Promise<void> => nostalgicDiva.play()}
						disabled={playerStore.currentVideo === undefined}
					>
						Play
					</EuiButton>
				)}
			</div>
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
