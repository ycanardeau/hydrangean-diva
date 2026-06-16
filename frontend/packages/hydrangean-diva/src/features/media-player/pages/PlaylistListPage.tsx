import { CreatePlaylistButton } from '@/features/media-player/components/CreatePlaylistButton';
import { PlaylistListTable } from '@/features/media-player/components/PlaylistListTable';
import { usePlaylistList } from '@/features/media-player/contexts/PlaylistListContext';
import type { IPlaylistListStore } from '@/features/media-player/interfaces/IPlaylistListStore';
import { AppPageTemplateHeader } from '@/shared/components/AppPageTemplateHeader';
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
			async (value: string): Promise<void> => {
				await playlistList.addItem(playlistList.createItem(value));
			},
			[playlistList],
		);

		return (
			<EuiPageTemplate.Section>
				<CreatePlaylistButton onFulfilled={handleCreatePlaylist}>
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
