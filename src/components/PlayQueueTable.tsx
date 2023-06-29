import { PlayQueueItem, PlayQueueStore } from '@/stores/PlayQueueStore';
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

interface PlayQueueTableRowPopoverProps {
	playQueueStore: PlayQueueStore;
	item: PlayQueueItem;
}

const PlayQueueTableRowPopover = React.memo(
	({
		playQueueStore,
		item,
	}: PlayQueueTableRowPopoverProps): React.ReactElement => {
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
				<EuiContextMenuPanel>
					<EuiContextMenuItem
						icon={<EuiIcon type="" />}
						onClick={async (): Promise<void> => {
							closePopover();
							await playQueueStore.playFirst([item.clone()]);
						}}
					>
						Play first{/* LOC */}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type="" />}
						onClick={async (): Promise<void> => {
							closePopover();
							await playQueueStore.playNext([item.clone()]);
						}}
					>
						Play next{/* LOC */}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type={AddRegular} />}
						onClick={async (): Promise<void> => {
							closePopover();
							await playQueueStore.addItems([item.clone()]);
						}}
					>
						Add to play queue{/* LOC */}
					</EuiContextMenuItem>
					<EuiHorizontalRule margin="none" />
					<EuiContextMenuItem
						icon={<EuiIcon type="" />}
						onClick={(): void => {
							closePopover();
							playQueueStore.removeItemsAbove(item);
						}}
					>
						Remove to the top{/* LOC */}
					</EuiContextMenuItem>
					<EuiContextMenuItem
						icon={<EuiIcon type="" />}
						onClick={(): void => {
							closePopover();
							playQueueStore.removeOtherItems(item);
						}}
					>
						Remove others{/* LOC */}
					</EuiContextMenuItem>
				</EuiContextMenuPanel>
			</EuiPopover>
		);
	},
);

interface PlayQueueTableRowActionsCellProps {
	playQueueStore: PlayQueueStore;
	item: PlayQueueItem;
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
							playQueueStore.setCurrentItem(item);
						}
					}}
				>
					Play{/* LOC */}
				</EuiButton>
				<EuiButton
					iconType={DismissRegular}
					size="s"
					onClick={(): Promise<void> =>
						playQueueStore.removeItems([item])
					}
				>
					Remove{/* LOC */}
				</EuiButton>
				<PlayQueueTableRowPopover
					playQueueStore={playQueueStore}
					item={item}
				/>
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
	item: PlayQueueItem;
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
