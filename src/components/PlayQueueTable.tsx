import { PlayQueueItemStore } from '@/stores/PlayQueueItemStore';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerType, useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiButtonIcon,
	EuiCheckbox,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiHorizontalRule,
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
import React from 'react';
import { ReactSortable } from 'react-sortablejs';

interface PlayQueueTableHeaderProps {
	playQueueStore: PlayQueueStore;
}

const PlayQueueTableHeader = observer(
	({ playQueueStore }: PlayQueueTableHeaderProps): React.ReactElement => {
		return (
			<EuiTableHeader>
				<EuiTableHeaderCellCheckbox>
					<EuiCheckbox
						id="" // TODO
						checked={playQueueStore.allItemsSelected}
						onChange={(e): void => {
							playQueueStore.allItemsSelected = e.target.checked;
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

interface PlayQueueTableRowContextMenuPanelProps {
	item: PlayQueueItemStore;
	closePopover: () => void;
}

const PlayQueueTableRowContextMenuPanel = React.memo(
	({
		item,
		closePopover,
	}: PlayQueueTableRowContextMenuPanelProps): React.ReactElement => {
		const handleClickPlayFirst =
			React.useCallback(async (): Promise<void> => {
				closePopover();

				await item.playFirst();
			}, [closePopover, item]);

		const handleClickPlayNext =
			React.useCallback(async (): Promise<void> => {
				closePopover();

				await item.playNext();
			}, [closePopover, item]);

		const handleClickAddToPlayQueue =
			React.useCallback(async (): Promise<void> => {
				closePopover();

				await item.addToPlayQueue();
			}, [closePopover, item]);

		const handleClickMoveToTop =
			React.useCallback(async (): Promise<void> => {
				closePopover();

				item.moveToTop();
			}, [closePopover, item]);

		const handleClickMoveToBottom =
			React.useCallback(async (): Promise<void> => {
				closePopover();

				item.moveToBottom();
			}, [closePopover, item]);

		const handleClickRemoveToTop = React.useCallback((): void => {
			closePopover();

			item.removeToTop();
		}, [closePopover, item]);

		const handleClickRemoveOthers = React.useCallback((): void => {
			closePopover();

			item.removeOthers();
		}, [closePopover, item]);

		return (
			<EuiContextMenuPanel>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={handleClickPlayFirst}
				>
					Play first{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={handleClickPlayNext}
				>
					Play next{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type={AddRegular} />}
					onClick={handleClickAddToPlayQueue}
				>
					Add to play queue{/* LOC */}
				</EuiContextMenuItem>
				<EuiHorizontalRule margin="none" />
				<EuiContextMenuItem
					icon={<EuiIcon type={ArrowUploadRegular} />}
					onClick={handleClickMoveToTop}
					disabled={!item.canMoveToTop}
				>
					Move to the top{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type={ArrowDownloadRegular} />}
					onClick={handleClickMoveToBottom}
					disabled={!item.canMoveToBottom}
				>
					Move to the bottom{/* LOC */}
				</EuiContextMenuItem>
				<EuiHorizontalRule margin="none" />
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={handleClickRemoveToTop}
					disabled={!item.canRemoveToTop}
				>
					Remove to the top{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={handleClickRemoveOthers}
					disabled={!item.canRemoveOthers}
				>
					Remove others{/* LOC */}
				</EuiContextMenuItem>
			</EuiContextMenuPanel>
		);
	},
);

interface PlayQueueTableRowPopoverProps {
	item: PlayQueueItemStore;
}

const PlayQueueTableRowPopover = React.memo(
	({ item }: PlayQueueTableRowPopoverProps): React.ReactElement => {
		const [isOpen, setIsOpen] = React.useState(false);

		const togglePopover = React.useCallback(
			() => setIsOpen(!isOpen),
			[isOpen],
		);
		const closePopover = React.useCallback(() => setIsOpen(false), []);

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
				<PlayQueueTableRowContextMenuPanel
					item={item}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

interface PlayQueueTableRowActionsCellProps {
	playQueueStore: PlayQueueStore;
	item: PlayQueueItemStore;
}

const PlayQueueTableRowActionsCell = observer(
	({
		playQueueStore,
		item,
	}: PlayQueueTableRowActionsCellProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		return (
			<EuiTableRowCell
				showOnHover
				textOnly={false}
				hasActions
				align="right"
			>
				<EuiButton
					iconType={PlayRegular}
					size="s"
					onClick={async (): Promise<void> => {
						if (playQueueStore.currentItem === item) {
							await diva.setCurrentTime(0);
						} else {
							item.play();
						}
					}}
				>
					Play{/* LOC */}
				</EuiButton>
				<EuiButton
					iconType={DismissRegular}
					size="s"
					onClick={item.remove}
				>
					Remove{/* LOC */}
				</EuiButton>
				<PlayQueueTableRowPopover item={item} />
			</EuiTableRowCell>
		);
	},
);

const videoServiceIcons: Record<PlayerType, string> = {
	Audio: '' /* TODO */,
	Dailymotion: 'https://www.dailymotion.com/favicon.ico',
	Niconico: 'https://www.nicovideo.jp/favicon.ico',
	SoundCloud: 'https://soundcloud.com/favicon.ico',
	Twitch: 'https://www.twitch.tv/favicon.ico',
	Vimeo: 'https://vimeo.com/favicon.ico',
	YouTube: 'https://www.youtube.com/favicon.ico',
};

interface PlayQueueTableRowProps {
	playQueueStore: PlayQueueStore;
	item: PlayQueueItemStore;
}

const PlayQueueTableRow = observer(
	({ playQueueStore, item }: PlayQueueTableRowProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		return (
			<EuiTableRow
				key={item.id}
				isSelected={item === playQueueStore.currentItem}
			>
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
					<EuiLink
						href={item.url}
						target="_blank"
						external
						onClick={(): Promise<void> => diva.pause()}
					>
						{item.title}
					</EuiLink>
				</EuiTableRowCell>
				<PlayQueueTableRowActionsCell
					playQueueStore={playQueueStore}
					item={item}
				/>
			</EuiTableRow>
		);
	},
);

interface PlayQueueTableBodyProps {
	playQueueStore: PlayQueueStore;
}

const PlayQueueTableBody = observer(
	({ playQueueStore }: PlayQueueTableBodyProps): React.ReactElement => {
		return (
			<ReactSortable
				tag="tbody"
				list={playQueueStore.items}
				setList={(items): void => playQueueStore.setItems(items)}
			>
				{playQueueStore.items.map((item) => (
					<PlayQueueTableRow
						key={item.id}
						playQueueStore={playQueueStore}
						item={item}
					/>
				))}
			</ReactSortable>
		);
	},
);

interface PlayQueueTableProps {
	playQueueStore: PlayQueueStore;
}

export const PlayQueueTable = observer(
	({ playQueueStore }: PlayQueueTableProps): React.ReactElement => {
		return (
			<EuiTable>
				<PlayQueueTableHeader playQueueStore={playQueueStore} />
				<PlayQueueTableBody playQueueStore={playQueueStore} />
			</EuiTable>
		);
	},
);
