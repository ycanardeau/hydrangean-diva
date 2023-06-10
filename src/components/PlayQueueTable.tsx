import { usePlayerStore } from '@/components/PlayerStoreContext';
import {
	EuiCheckbox,
	EuiLink,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableHeaderCellCheckbox,
	EuiTableRow,
	EuiTableRowCell,
	EuiTableRowCellCheckbox,
} from '@elastic/eui';
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
