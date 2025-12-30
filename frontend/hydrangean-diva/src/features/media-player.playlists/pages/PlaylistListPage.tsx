import { AppLink } from '@/common/components/AppLink';
import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { MobXObservableStateProvider } from '@/features/common';
import { useLocationStateStore } from '@/features/common/components/useLocationStateHandler';
import {
	CreatePlaylistButton,
	CreatePlaylistFormSubmitEvent,
} from '@/features/media-player.playlists/components/CreatePlaylistButton';
import { mediaPlayerPlaylistsApi } from '@/features/media-player.playlists/helpers/mediaPlayerPlaylistsApi';
import { PlaylistListStore } from '@/features/media-player.playlists/stores/PlaylistListStore';
import { EuiBasicTable, EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { ReactElement, memo, useCallback, useState } from 'react';

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
				loading={playlistList.loading}
			/>
		);
	},
);

interface PlaylistListPageBodyProps {
	playlistList: PlaylistListStore;
}

const PlaylistListPageBody = observer(
	({ playlistList }: PlaylistListPageBodyProps): ReactElement => {
		useLocationStateStore(playlistList);

		const handleCreatePlaylist = useCallback(
			async (e: CreatePlaylistFormSubmitEvent): Promise<void> => {
				await mediaPlayerPlaylistsApi.mediaPlayerPlaylistsPost({
					hydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest:
						{
							name: e.name,
						},
				});

				await playlistList.updateResults();
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
	const [playlistList] = useState(
		() =>
			new PlaylistListStore(
				new MobXObservableStateProvider(),
				mediaPlayerPlaylistsApi,
			),
	);

	return (
		<>
			<PlaylistListPageHeader />
			<PlaylistListPageBody playlistList={playlistList} />
		</>
	);
});
