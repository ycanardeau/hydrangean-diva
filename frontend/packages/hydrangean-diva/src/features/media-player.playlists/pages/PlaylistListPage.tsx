import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { usePlaylistList } from '@/features/media-player.playlists.abstractions/contexts/PlaylistListContext';
import type { IPlaylistListStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListStore';
import {
	CreatePlaylistButton,
	type CreatePlaylistFormSubmitEvent,
} from '@/features/media-player.playlists/components/CreatePlaylistButton';
import { PlaylistListTable } from '@/features/media-player.playlists/components/PlaylistListTable';
import { EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement, memo, useCallback } from 'react';

const PlaylistListPageHeader = (): ReactElement => {
	return (
		<AppPageTemplateHeader
			pageTitle="Playlists" /* LOC */
			breadcrumbs={[
				{
					text: 'Playlists' /* LOC */,
				},
			]}
		/>
	);
};

interface PlaylistListPageBodyProps {
	playlistList: IPlaylistListStore;
}

const PlaylistListPageBody = observer(
	({ playlistList }: PlaylistListPageBodyProps): ReactElement => {
		const handleCreatePlaylist = useCallback(
			async (e: CreatePlaylistFormSubmitEvent): Promise<void> => {
				await playlistList.addItem(playlistList.createItem(e.name));
			},
			[playlistList],
		);

		return (
			<EuiPageTemplate.Section>
				<CreatePlaylistButton onSave={handleCreatePlaylist}>
					New playlist{/* LOC */}
				</CreatePlaylistButton>

				<EuiSpacer size="l" />
				<PlaylistListTable playlistList={playlistList} />
			</EuiPageTemplate.Section>
		);
	},
);

export const PlaylistListPage = memo((): ReactElement => {
	const playlistList = usePlaylistList();

	return (
		<>
			<PlaylistListPageHeader />
			<PlaylistListPageBody playlistList={playlistList} />
		</>
	);
});
