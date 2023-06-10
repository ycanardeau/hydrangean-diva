import { usePlayerStore } from '@/components/PlayerStoreContext';
import { PlayQueueItem } from '@/stores/PlayQueueStore';
import {
	EuiButtonIcon,
	EuiCheckbox,
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
import { MoreHorizontalFilled } from '@fluentui/react-icons';
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

const PlayQueueTableRowPopover = (): React.ReactElement => {
	return (
		<EuiPopover
			button={
				<EuiButtonIcon
					iconType={MoreHorizontalFilled}
					size="s"
					color="text"
				/>
			}
		></EuiPopover>
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
					<PlayQueueTableRowPopover />
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
