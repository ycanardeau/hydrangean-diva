import { PlayerType, useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	CommonProps,
	EuiButton,
	EuiButtonIcon,
	EuiCheckbox,
	EuiContextMenuItem,
	EuiContextMenuItemProps,
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
	ButtonHTMLAttributes,
	memo,
	ReactElement,
	useCallback,
	useState,
} from 'react';
import { ReactSortable } from 'react-sortablejs';

import { IPlayQueueItemStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueItemStore';
import { IPlayQueueStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueStore';

interface PlayQueueTableHeaderProps {
	playQueueStore: IPlayQueueStore;
}

const PlayQueueTableHeader = observer(
	({ playQueueStore }: PlayQueueTableHeaderProps): ReactElement => {
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
	item: IPlayQueueItemStore;
	closePopover: () => void;
}

const PlayQueueTableRowContextMenuPanel = memo(
	({
		item,
		closePopover,
	}: PlayQueueTableRowContextMenuPanelProps): ReactElement => {
		const ContextMenuItem = memo(
			({
				onClick,
				...props
			}: CommonProps &
				Omit<
					ButtonHTMLAttributes<HTMLButtonElement>,
					'onClick' | 'disabled' | 'type'
				> &
				EuiContextMenuItemProps): ReactElement => {
				const handleClick = useCallback(
					(e: React.MouseEvent) => {
						closePopover();

						onClick?.(e);
					},
					[onClick],
				);

				return <EuiContextMenuItem {...props} onClick={handleClick} />;
			},
		);

		return (
			<EuiContextMenuPanel>
				<ContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={item.playFirst}
				>
					Play first{/* LOC */}
				</ContextMenuItem>
				<ContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={item.playNext}
				>
					Play next{/* LOC */}
				</ContextMenuItem>
				<ContextMenuItem
					icon={<EuiIcon type={AddRegular} />}
					onClick={item.addToPlayQueue}
				>
					Add to play queue{/* LOC */}
				</ContextMenuItem>
				<EuiHorizontalRule margin="none" />
				<ContextMenuItem
					icon={<EuiIcon type={ArrowUploadRegular} />}
					onClick={item.moveToTop}
					disabled={!item.canMoveToTop}
				>
					Move to the top{/* LOC */}
				</ContextMenuItem>
				<ContextMenuItem
					icon={<EuiIcon type={ArrowDownloadRegular} />}
					onClick={item.moveToBottom}
					disabled={!item.canMoveToBottom}
				>
					Move to the bottom{/* LOC */}
				</ContextMenuItem>
				<EuiHorizontalRule margin="none" />
				<ContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={item.removeToTop}
					disabled={!item.canRemoveToTop}
				>
					Remove to the top{/* LOC */}
				</ContextMenuItem>
				<ContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={item.removeOthers}
					disabled={!item.canRemoveOthers}
				>
					Remove others{/* LOC */}
				</ContextMenuItem>
			</EuiContextMenuPanel>
		);
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
				<PlayQueueTableRowContextMenuPanel
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
	playQueueStore: IPlayQueueStore;
}

const PlayQueueTableBody = observer(
	({ playQueueStore }: PlayQueueTableBodyProps): ReactElement => {
		return (
			<ReactSortable
				tag="tbody"
				list={playQueueStore.items}
				setList={(items): void => playQueueStore.setItems(items)}
			>
				{playQueueStore.items.map((item) => (
					<PlayQueueTableRow key={item.id} item={item} />
				))}
			</ReactSortable>
		);
	},
);

interface PlayQueueTableProps {
	playQueueStore: IPlayQueueStore;
}

export const PlayQueueTable = observer(
	({ playQueueStore }: PlayQueueTableProps): ReactElement => {
		return (
			<EuiTable>
				<PlayQueueTableHeader playQueueStore={playQueueStore} />
				<PlayQueueTableBody playQueueStore={playQueueStore} />
			</EuiTable>
		);
	},
);
