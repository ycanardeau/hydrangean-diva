import { AppLink } from '@/common/components/AppLink';
import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import {
	CreatePlaylistButton,
	type CreatePlaylistFormSubmitEvent,
} from '@/features/media-player.playlists/components/CreatePlaylistButton';
import { usePlaylistList } from '@/features/media-player.playlists/contexts/PlaylistListContext';
import { PlaylistListStore } from '@/features/media-player.playlists/stores/PlaylistListStore';
import { EuiBasicTable, EuiPageTemplate, EuiSpacer } from '@elastic/eui';
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

interface PlaylistListTableProps {
	playlistList: PlaylistListStore;
}

const PlaylistListTable = observer(
	({ playlistList }: PlaylistListTableProps): ReactElement => {
		return (
			<EuiBasicTable
				responsiveBreakpoint={false}
				items={playlistList.items}
				itemId="id"
				rowHeader="name"
				columns={[
					{
						field: 'name',
						name: 'Name' /* LOC */,
						render: (_, item) => (
							<AppLink
								linkProps={{
									to: '/playlists/$playlistId',
									params: { playlistId: item.id },
								}}
							>
								{item.name}
							</AppLink>
						),
					},
				]}
				rowProps={{}}
				cellProps={{}}
			/>
		);
	},
);

interface PlaylistListPageBodyProps {
	playlistList: PlaylistListStore;
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
