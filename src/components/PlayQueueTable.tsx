import { PlayQueueItem, PlayQueueStore } from '@/stores/PlayQueueStore';
import {
	EuiButtonIcon,
	EuiCheckbox,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiHorizontalRule,
	EuiIcon,
	EuiLink,
	EuiPopover,
	EuiTable,
	EuiTableBody,
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

const PlayQueueTableHeader = observer((): React.ReactElement => {
	return (
		<EuiTableHeader>
			<EuiTableHeaderCellCheckbox>
				<EuiCheckbox
					id="" // TODO
					onChange={(): void => {}} // TODO
				/>
			</EuiTableHeaderCellCheckbox>
			<EuiTableHeaderCell>Title{/* LOC */}</EuiTableHeaderCell>
			<EuiTableHeaderCell />
		</EuiTableHeader>
	);
});

interface PlayQueueTableRowPopoverProps {
	playQueueStore: PlayQueueStore;
	item: PlayQueueItem;
}

const PlayQueueTableRowPopover = ({
	playQueueStore,
	item,
}: PlayQueueTableRowPopoverProps): React.ReactElement => {
	const [isOpen, setIsOpen] = React.useState(false);

	const togglePopover = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);
	const closePopover = React.useCallback(() => setIsOpen(false), []);

	return (
		<EuiPopover
			button={
				<EuiButtonIcon
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
					icon={<EuiIcon type={PlayRegular} />}
					onClick={(): void => {
						// TODO
						playQueueStore.setCurrentItem(item);
						closePopover();
					}}
				>
					Play{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={(): void => {
						closePopover();
					}}
				>
					Play first{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={(): void => {
						closePopover();
					}}
				>
					Play next{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type={AddRegular} />}
					onClick={(): void => {
						closePopover();
					}}
				>
					Add to play queue{/* LOC */}
				</EuiContextMenuItem>
				<EuiHorizontalRule margin="none" />
				<EuiContextMenuItem
					icon={<EuiIcon type={DismissRegular} />}
					onClick={(): void => {
						closePopover();
					}}
				>
					Remove{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={(): void => {
						closePopover();
					}}
				>
					Remove to the top{/* LOC */}
				</EuiContextMenuItem>
				<EuiContextMenuItem
					icon={<EuiIcon type="" />}
					onClick={(): void => {
						closePopover();
					}}
				>
					Remove others{/* LOC */}
				</EuiContextMenuItem>
			</EuiContextMenuPanel>
		</EuiPopover>
	);
};

interface PlayQueueTableRowProps {
	playQueueStore: PlayQueueStore;
	item: PlayQueueItem;
}

const PlayQueueTableRow = observer(
	({ playQueueStore, item }: PlayQueueTableRowProps): React.ReactElement => {
		return (
			<EuiTableRow key={item.id}>
				<EuiTableRowCellCheckbox>
					<EuiCheckbox
						id="" // TODO
						onChange={(): void => {}} // TODO
					/>
				</EuiTableRowCellCheckbox>
				<EuiTableRowCell>
					<EuiLink href="#">{item.title}</EuiLink>
				</EuiTableRowCell>
				<EuiTableRowCell textOnly={false} hasActions align="right">
					<PlayQueueTableRowPopover
						playQueueStore={playQueueStore}
						item={item}
					/>
				</EuiTableRowCell>
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
			<EuiTableBody>
				{playQueueStore.items.map((item, index) => (
					<PlayQueueTableRow
						key={index}
						playQueueStore={playQueueStore}
						item={item}
					/>
				))}
			</EuiTableBody>
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
				<PlayQueueTableHeader />
				<PlayQueueTableBody playQueueStore={playQueueStore} />
			</EuiTable>
		);
	},
);
