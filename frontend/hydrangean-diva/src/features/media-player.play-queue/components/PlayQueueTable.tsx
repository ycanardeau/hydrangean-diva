import { videoServiceIcons } from '@/features/common/helpers/videoServiceIcons';
import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiButtonIcon,
	EuiCheckbox,
	EuiContextMenu,
	type EuiContextMenuPanelDescriptor,
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
	useEuiTheme,
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
import React, {
	type ReactElement,
	memo,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { ReactSortable } from 'react-sortablejs';

interface PlayQueueTableHeaderProps {
	playQueue: IPlayQueueStore;
}

const PlayQueueTableHeader = observer(
	({ playQueue }: PlayQueueTableHeaderProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		return (
			<EuiTableHeader
				style={{
					position: 'sticky',
					top: 48 + 40 + 24,
					zIndex: 998,
					background: euiTheme.colors.backgroundBasePlain,
				}}
			>
				<EuiTableHeaderCellCheckbox>
					<EuiCheckbox
						id="" // TODO
						checked={playQueue.allItemsSelected}
						onChange={(e): void => {
							if (e.target.checked) {
								playQueue.selectAll();
							} else {
								playQueue.unselectAll();
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

interface PlayQueueTableRowContextMenuProps {
	item: IPlayQueueItemStore;
	closePopover: () => void;
}

const PlayQueueTableRowContextMenu = memo(
	({
		item,
		closePopover,
	}: PlayQueueTableRowContextMenuProps): ReactElement => {
		const panels = useMemo(
			(): EuiContextMenuPanelDescriptor[] => [
				{
					id: 0,
					items: [
						{
							name: 'Play first' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								closePopover();

								await item.playFirst();
							},
						},
						{
							name: 'Play next' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								closePopover();

								await item.playNext();
							},
						},
						{
							name: 'Add to play queue' /* LOC */,
							icon: <EuiIcon type={AddRegular} />,
							onClick: async (): Promise<void> => {
								closePopover();

								await item.addToPlayQueue();
							},
						},
						{
							isSeparator: true,
						},
						{
							name: 'Move to the top' /* LOC */,
							icon: <EuiIcon type={ArrowUploadRegular} />,
							onClick: async (): Promise<void> => {
								closePopover();

								item.moveToTop();
							},
							disabled: !item.canMoveToTop,
						},
						{
							name: 'Move to the bottom' /* LOC */,
							icon: <EuiIcon type={ArrowDownloadRegular} />,
							onClick: async (): Promise<void> => {
								closePopover();

								item.moveToBottom();
							},
							disabled: !item.canMoveToBottom,
						},
						{
							isSeparator: true,
						},
						{
							name: 'Remove to the top' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								closePopover();

								await item.removeToTop();
							},
							disabled: !item.canRemoveToTop,
						},
						{
							name: 'Remove others' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								closePopover();

								await item.removeOthers();
							},
							disabled: !item.canRemoveOthers,
						},
					],
				},
			],
			[closePopover, item],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface PlayQueueTableRowPopoverProps {
	item: IPlayQueueItemStore;
}

const PlayQueueTableRowPopover = memo(
	({ item }: PlayQueueTableRowPopoverProps): ReactElement => {
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
				<PlayQueueTableRowContextMenu
					item={item}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

interface PlayQueueTableRowActionsCellProps {
	item: IPlayQueueItemStore;
}

const PlayQueueTableRowActionsCell = observer(
	({ item }: PlayQueueTableRowActionsCellProps): ReactElement => {
		const diva = useNostalgicDiva();

		return (
			<EuiTableRowCell textOnly={false} hasActions align="right">
				<EuiButton
					iconType={PlayRegular}
					size="s"
					onClick={async (): Promise<void> => {
						if (item.isCurrent) {
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

interface PlayQueueTableRowProps {
	item: IPlayQueueItemStore;
}

const PlayQueueTableRow = observer(
	({ item }: PlayQueueTableRowProps): ReactElement => {
		const diva = useNostalgicDiva();

		return (
			<EuiTableRow key={item.id} isSelected={item.isCurrent}>
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
				<PlayQueueTableRowActionsCell item={item} />
			</EuiTableRow>
		);
	},
);

interface PlayQueueTableBodyProps {
	playQueue: IPlayQueueStore;
}

const PlayQueueTableBody = observer(
	({ playQueue }: PlayQueueTableBodyProps): ReactElement => {
		return (
			<ReactSortable
				tag="tbody"
				list={playQueue.items}
				setList={(items): void => playQueue.setItems(items)}
			>
				{playQueue.items.map((item) => (
					<PlayQueueTableRow key={item.id} item={item} />
				))}
			</ReactSortable>
		);
	},
);

interface PlayQueueTableProps {
	playQueue: IPlayQueueStore;
}

export const PlayQueueTable = observer(
	({ playQueue }: PlayQueueTableProps): ReactElement => {
		return (
			<EuiTable>
				<PlayQueueTableHeader playQueue={playQueue} />
				<PlayQueueTableBody playQueue={playQueue} />
			</EuiTable>
		);
	},
);
