import { AppLink } from '@/common/components/AppLink';
import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';
import type { IPlaylistListStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListStore';
import {
	EuiTable,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface PlaylistListTableHeaderProps {
	playlistList: IPlaylistListStore;
}

const PlaylistListTableHeader = observer(
	({ playlistList }: PlaylistListTableHeaderProps): ReactElement => {
		return (
			<EuiTableHeader>
				<EuiTableHeaderCell>Name{/* LOC */}</EuiTableHeaderCell>
			</EuiTableHeader>
		);
	},
);

interface PlaylistListTableRowProps {
	item: IPlaylistListItemStore;
}

const PlaylistListTableRow = observer(
	({ item }: PlaylistListTableRowProps): ReactElement => {
		return (
			<EuiTableRow key={item.id}>
				<EuiTableRowCell>
					<AppLink
						linkProps={{
							to: '/playlists/$playlistId',
							params: { playlistId: item.id },
						}}
					>
						{item.name}
					</AppLink>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface PlaylistListTableBodyProps {
	playlistList: IPlaylistListStore;
}

const PlaylistListTableBody = observer(
	({ playlistList }: PlaylistListTableBodyProps): ReactElement => {
		return (
			<ReactSortable
				tag="tbody"
				list={playlistList.items}
				setList={(items): void => playlistList.setItems(items)}
			>
				{playlistList.items.map((item) => (
					<PlaylistListTableRow key={item.id} item={item} />
				))}
			</ReactSortable>
		);
	},
);

interface PlaylistListTableProps {
	playlistList: IPlaylistListStore;
}

export const PlaylistListTable = observer(
	({ playlistList }: PlaylistListTableProps): ReactElement => {
		return (
			<EuiTable>
				<PlaylistListTableHeader playlistList={playlistList} />
				<PlaylistListTableBody playlistList={playlistList} />
			</EuiTable>
		);
	},
);
