import { usePlayerStore } from '@/components/PlayerStoreContext';
import { PlayQueueItem } from '@/stores/PlayQueueStore';
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
	item: PlayQueueItem;
}

const PlayQueueTableRowPopover = ({
	item,
}: PlayQueueTableRowPopoverProps): React.ReactElement => {
	const [isOpen, setIsOpen] = React.useState(false);

	const togglePopover = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);
	const closePopover = React.useCallback(() => setIsOpen(false), []);

	const playerStore = usePlayerStore();

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
						playerStore.setCurrentItem(item);
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
	item: PlayQueueItem;
}

const PlayQueueTableRow = observer(
	({ item }: PlayQueueTableRowProps): React.ReactElement => {
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
					<PlayQueueTableRowPopover item={item} />
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

const PlayQueueTableBody = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	return (
		<EuiTableBody>
			{playerStore.items.map((item, index) => (
				<PlayQueueTableRow key={index} item={item} />
			))}
		</EuiTableBody>
	);
});

export const PlayQueueTable = observer((): React.ReactElement => {
	return (
		<EuiTable>
			<PlayQueueTableHeader />
			<PlayQueueTableBody />
		</EuiTable>
	);
});
