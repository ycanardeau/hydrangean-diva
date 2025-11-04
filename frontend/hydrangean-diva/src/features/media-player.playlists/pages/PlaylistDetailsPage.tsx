import {
	EuiButton,
	EuiFlexGroup,
	EuiFlexItem,
	EuiPageTemplate,
	useEuiTheme,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	PlayRegular,
	RenameRegular,
} from '@fluentui/react-icons';
import { ReactElement } from 'react';

const PlayAllButton = (): ReactElement => {
	return <EuiButton iconType={PlayRegular}>Play all{/* LOC */}</EuiButton>;
};

const AddToButton = (): ReactElement => {
	return <EuiButton iconType={AddRegular}>Add to{/* LOC */}</EuiButton>;
};

const RenameButton = (): ReactElement => {
	return <EuiButton iconType={RenameRegular}>Rename{/* LOC */}</EuiButton>;
};

const DeleteButton = (): ReactElement => {
	return <EuiButton iconType={DeleteRegular}>Delete{/* LOC */}</EuiButton>;
};

export const PlaylistDetailsPage = (): ReactElement => {
	const { euiTheme } = useEuiTheme();

	return (
		<>
			<EuiPageTemplate.Header
				pageTitle="Playlist"
				description={`${0} items`}
			/>

			<EuiPageTemplate.Section>
				<EuiFlexGroup
					alignItems="center"
					gutterSize="m"
					style={{
						position: 'sticky',
						top: 48,
						zIndex: 998,
						background: euiTheme.colors.backgroundBasePlain,
					}}
				>
					<EuiFlexItem grow={false}>
						<PlayAllButton />
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<AddToButton />
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<RenameButton />
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<DeleteButton />
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiPageTemplate.Section>
		</>
	);
};
