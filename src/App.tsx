import {
	NostalgicDiva,
	NostalgicDivaProvider,
	PlayerType,
	useNostalgicDiva,
} from '@aigamo/nostalgic-diva';
import { EuiButton, EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
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

interface Video {
	type: PlayerType;
	videoId: string;
	title: string;
}

const AppContainer = (): React.ReactElement => {
	const [videos] = React.useState<Video[]>([
		{ type: 'YouTube', videoId: 'bGdtvUQ9OAs', title: 'nostalgic diva' },
		{ type: 'Niconico', videoId: 'sm26653696', title: 'nostalgic diva' },
		{ type: 'Niconico', videoId: 'sm23384530', title: 'The Wind-Up Diva' },
		{ type: 'YouTube', videoId: 'jUe7dDLGpv8', title: 'Hydrangean Diva' },
		{ type: 'Niconico', videoId: 'sm24890523', title: 'Hydrangean Diva' },
	]);

	const [selectedVideo, setSelectedVideo] = React.useState<Video>();

	const nostalgicDiva = useNostalgicDiva();

	return (
		<>
			<div>
				{videos.map((video, index) => (
					<React.Fragment key={index}>
						<EuiButton
							iconType={videoServiceIcons[video.type]}
							onClick={(): void => setSelectedVideo(video)}
						>
							{video.title}
						</EuiButton>
					</React.Fragment>
				))}
			</div>

			{selectedVideo && (
				<NostalgicDiva
					type={selectedVideo.type}
					videoId={selectedVideo.videoId}
				/>
			)}

			<div>
				<EuiButton onClick={(): Promise<void> => nostalgicDiva.play()}>
					Play
				</EuiButton>
			</div>
		</>
	);
};

const App = (): React.ReactElement => {
	return (
		<EuiProvider colorMode="dark" cache={euiCache}>
			<NostalgicDivaProvider>
				<AppContainer />
			</NostalgicDivaProvider>
		</EuiProvider>
	);
};

export default App;
