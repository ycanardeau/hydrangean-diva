import { videoServiceIcons } from '@/features/common/helpers/videoServiceIcons';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';
import type { IPlaylistStore } from '@/features/media-player.playlists/interfaces/IPlaylistStore';
import {
	EuiButton,
	EuiButtonIcon,
	EuiCheckbox,
	EuiContextMenu,
	type EuiContextMenuItemIcon,
	type EuiContextMenuPanelDescriptor,
	type EuiContextMenuPanelItemDescriptor,
	EuiIcon,
	EuiLink,
	EuiPopover,
	EuiTable,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableHeaderCellCheckbox,
	EuiTableRow,
	EuiTableRowCell,
	EuiTableRowCellCheckbox,
} from '@elastic/eui';
import {
	AddRegular,
	ArrowDownloadRegular,
	ArrowUploadRegular,
	DismissRegular,
	MoreHorizontalFilled,
	PlayRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, memo, useCallback, useMemo, useState } from 'react';
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

interface PlaylistTableRowContextMenuProps {
	item: IPlaylistItemStore;
	closePopover: () => void;
}

const PlaylistTableRowContextMenu = memo(
	({
		item,
		closePopover,
	}: PlaylistTableRowContextMenuProps): ReactElement => {
		const createItem = useCallback(
			({
				name,
				icon,
				disabled,
				onClick,
			}: {
				name: string;
				icon: EuiContextMenuItemIcon;
				disabled?: boolean;
				onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
			}): EuiContextMenuPanelItemDescriptor => ({
				name: name,
				icon: icon,
				disabled: disabled,
				onClick: async (e): Promise<void> => {
					closePopover();

					onClick(e);
				},
			}),
			[closePopover],
		);

		const panels = useMemo(
			(): EuiContextMenuPanelDescriptor[] => [
				{
					id: 0,
					items: [
						createItem({
							name: 'Play first' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: item.playFirst,
						}),
						createItem({
							name: 'Play next' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: item.playNext,
						}),
						createItem({
							name: 'Add to play queue' /* LOC */,
							icon: <EuiIcon type={AddRegular} />,
							onClick: item.addToPlayQueue,
						}),
						{
							isSeparator: true,
						},
						createItem({
							name: 'Move to the top' /* LOC */,
							icon: <EuiIcon type={ArrowUploadRegular} />,
							onClick: item.moveToTop,
							disabled: !item.canMoveToTop,
						}),
						createItem({
							name: 'Move to the bottom' /* LOC */,
							icon: <EuiIcon type={ArrowDownloadRegular} />,
							onClick: item.moveToBottom,
							disabled: !item.canMoveToBottom,
						}),
						{
							isSeparator: true,
						},
						createItem({
							name: 'Remove to the top' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: item.removeToTop,
							disabled: !item.canRemoveToTop,
						}),
						createItem({
							name: 'Remove others' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: item.removeOthers,
							disabled: !item.canRemoveOthers,
						}),
					],
				},
			],
			[createItem, item],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface PlaylistTableRowPopoverProps {
	item: IPlaylistItemStore;
}

const PlaylistTableRowPopover = memo(
	({ item }: PlaylistTableRowPopoverProps): ReactElement => {
		const [isOpen, setIsOpen] = useState(false);

		const togglePopover = useCallback(() => setIsOpen(!isOpen), [isOpen]);
		const closePopover = useCallback(() => setIsOpen(false), []);

		return (
			<EuiPopover
				button={
					<EuiButtonIcon
						title="More options"
						aria-label="More options"
						iconType={MoreHorizontalFilled}
						size="s"
						color="text"
						onClick={togglePopover}
					/>
				}
				isOpen={isOpen}
				closePopover={closePopover}
				panelPaddingSize="none"
				anchorPosition="leftCenter"
			>
				<PlaylistTableRowContextMenu
					item={item}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

interface PlaylistTableRowActionsCellProps {
	item: IPlaylistItemStore;
}

const PlaylistTableRowActionsCell = observer(
	({ item }: PlaylistTableRowActionsCellProps): ReactElement => {
		return (
			<EuiTableRowCell textOnly={false} hasActions align="right">
				<EuiButton iconType={PlayRegular} size="s" onClick={item.play}>
					Play{/* LOC */}
				</EuiButton>
				<EuiButton
					iconType={DismissRegular}
					size="s"
					onClick={item.remove}
				>
					Remove{/* LOC */}
				</EuiButton>
				<PlaylistTableRowPopover item={item} />
			</EuiTableRowCell>
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
