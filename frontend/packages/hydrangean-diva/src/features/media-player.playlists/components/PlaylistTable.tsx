import { videoServiceIcons } from '@/features/common/helpers/videoServiceIcons';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';
import type { IPlaylistStore } from '@/features/media-player.playlists/interfaces/IPlaylistStore';
import {
	EuiCheckbox,
	EuiLink,
	EuiTable,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableHeaderCellCheckbox,
	EuiTableRow,
	EuiTableRowCell,
	EuiTableRowCellCheckbox,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface PlaylistTableHeaderProps {
	playlist: IPlaylistStore;
}

const PlaylistTableHeader = observer(
	({ playlist }: PlaylistTableHeaderProps): ReactElement => {
		return (
			<EuiTableHeader>
				<EuiTableHeaderCellCheckbox>
					<EuiCheckbox
						id="" // TODO
						checked={playlist.allItemsSelected}
						onChange={(e): void => {
							if (e.target.checked) {
								playlist.selectAll();
							} else {
								playlist.unselectAll();
							}
						}}
					/>
				</EuiTableHeaderCellCheckbox>
				<EuiTableHeaderCell width={24} />
				<EuiTableHeaderCell>Title{/* LOC */}</EuiTableHeaderCell>
				<EuiTableHeaderCell />
			</EuiTableHeader>
		);
	},
);

interface PlaylistTableRowActionsCellProps {
	item: IPlaylistItemStore;
}

const PlaylistTableRowActionsCell = observer(
	({ item }: PlaylistTableRowActionsCellProps): ReactElement => {
		return (
			<EuiTableRowCell
				textOnly={false}
				hasActions
				align="right"
			></EuiTableRowCell>
		);
	},
);

interface PlaylistTableRowProps {
	item: IPlaylistItemStore;
}

const PlaylistTableRow = observer(
	({ item }: PlaylistTableRowProps): ReactElement => {
		return (
			<EuiTableRow isSelected={item.isCurrent}>
				<EuiTableRowCellCheckbox>
					<EuiCheckbox
						id={item.id.toString() /* TODO */}
						checked={item.isSelected}
						onChange={item.toggleSelected}
					/>
				</EuiTableRowCellCheckbox>
				<EuiTableRowCell textOnly={false}>
					<img
						src={videoServiceIcons[item.type]}
						width={16}
						height={16}
						alt={item.type /* TODO */}
					/>
				</EuiTableRowCell>
				<EuiTableRowCell>
					<EuiLink href={item.url} target="_blank" external>
						{item.title}
					</EuiLink>
				</EuiTableRowCell>
				<PlaylistTableRowActionsCell item={item} />
			</EuiTableRow>
		);
	},
);

interface PlaylistTableBodyProps {
	playlist: IPlaylistStore;
}

const PlaylistTableBody = observer(
	({ playlist }: PlaylistTableBodyProps): ReactElement => {
		return (
			<ReactSortable
				tag="tbody"
				list={playlist.items}
				setList={(items): void => playlist.setItems(items)}
			>
				{playlist.items.map((item) => (
					<PlaylistTableRow key={item.id} item={item} />
				))}
			</ReactSortable>
		);
	},
);

interface PlaylistTableProps {
	playlist: IPlaylistStore;
}

export const PlaylistTable = observer(
	({ playlist }: PlaylistTableProps): ReactElement => {
		return (
			<EuiTable>
				<PlaylistTableHeader playlist={playlist} />
				<PlaylistTableBody playlist={playlist} />
			</EuiTable>
		);
	},
);
