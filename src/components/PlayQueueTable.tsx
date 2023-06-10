import { usePlayerStore } from '@/components/PlayerStoreContext';
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

const PlayQueueTableBody = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	return (
		<EuiTableBody>
			{playerStore.items.map((item, index) => (
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
						<EuiPopover
							button={
								<EuiButtonIcon
									iconType={MoreHorizontalFilled}
									size="s"
									color="text"
								/>
							}
						></EuiPopover>
					</EuiTableRowCell>
				</EuiTableRow>
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
