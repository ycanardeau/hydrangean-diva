import { AppLink } from '@/common/components/AppLink';
import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { localStorageStateKeys } from '@/features/common/stores/localStorageStateKeys';
import {
	CreatePlaylistButton,
	type CreatePlaylistFormSubmitEvent,
} from '@/features/media-player.playlists/components/CreatePlaylistButton';
import {
	PlaylistListItemStore,
	PlaylistListStore,
} from '@/features/media-player.playlists/stores/PlaylistListStore';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { EuiBasicTable, EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement, memo, useCallback, useState } from 'react';

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
		useLocalStorageState(
			localStorageStateKeys.playlistList,
			playlistList.localStorageState,
		);

		const handleCreatePlaylist = useCallback(
			async (e: CreatePlaylistFormSubmitEvent): Promise<void> => {
				await playlistList.addItem(
					new PlaylistListItemStore(crypto.randomUUID(), e.name),
				);
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
	const [playlistList] = useState(() => new PlaylistListStore());

	return (
		<>
			<PlaylistListPageHeader />
			<PlaylistListPageBody playlistList={playlistList} />
		</>
	);
});
