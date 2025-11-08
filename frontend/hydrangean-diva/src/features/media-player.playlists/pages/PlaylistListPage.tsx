import { EuiPageTemplate } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { memo, ReactElement, useState } from 'react';

import { MobXObservableStateProvider } from '@/features/common';
import { PlaylistListEmptyPrompt } from '@/features/media-player.playlists/components/PlaylistListEmptyPrompt';
import { PlaylistListStore } from '@/features/media-player.playlists/stores/PlaylistListStore';

const PlaylistListPageHeader = (): ReactElement => {
	return <EuiPageTemplate.Header pageTitle="Playlists" /* LOC */ />;
};

interface PlaylistListPageBodyProps {
	playlistListStore: PlaylistListStore;
}

const PlaylistListPageBody = observer(
	({ playlistListStore }: PlaylistListPageBodyProps): ReactElement => {
		return playlistListStore.items.length === 0 ? (
			<PlaylistListEmptyPrompt />
		) : (
			<></>
		);
	},
);

export const PlaylistListPage = memo((): ReactElement => {
	const [playlistListStore] = useState(
		() => new PlaylistListStore(new MobXObservableStateProvider()),
	);

	return (
		<>
			<PlaylistListPageHeader />

			<PlaylistListPageBody playlistListStore={playlistListStore} />
		</>
	);
});
