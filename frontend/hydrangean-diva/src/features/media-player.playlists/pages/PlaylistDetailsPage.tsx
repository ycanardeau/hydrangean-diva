import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiFlexGroup,
	EuiFlexItem,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiPageTemplate,
	useEuiTheme,
	useGeneratedHtmlId,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	PlayRegular,
	RenameRegular,
} from '@fluentui/react-icons';
import { ReactElement, useState } from 'react';

const PlayAllButton = (): ReactElement => {
	return <EuiButton iconType={PlayRegular}>Play all{/* LOC */}</EuiButton>;
};

const AddToButton = (): ReactElement => {
	return <EuiButton iconType={AddRegular}>Add to{/* LOC */}</EuiButton>;
};

interface RenamePlaylistFormSubmitEvent {
	name: string;
}

interface RenamePlaylistModalProps {
	onCancel: () => void;
	onSave: (e: RenamePlaylistFormSubmitEvent) => Promise<void>;
}

const RenamePlaylistModal = ({
	onCancel,
	onSave,
}: RenamePlaylistModalProps): ReactElement => {
	const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<EuiModal onClose={onCancel} initialFocus="[name=name]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Rename playlist{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<EuiForm
					id={modalFormId}
					component="form"
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						try {
							setLoading(true);

							await onSave({ name });
						} finally {
							setLoading(false);
						}
					}}
				>
					<EuiFormRow label="Name">
						<EuiFieldText
							name="name"
							value={name}
							onChange={(e): void => setName(e.target.value)}
						/>
					</EuiFormRow>
				</EuiForm>
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButtonEmpty onClick={onCancel}>
					Cancel{/* LOC */}
				</EuiButtonEmpty>

				<EuiButton
					type="submit"
					form={modalFormId}
					fill
					disabled={name.trim().length === 0}
					isLoading={loading}
				>
					Rename{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};

const RenameButton = (): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<>
			<EuiButton
				iconType={RenameRegular}
				onClick={(): void => setModalOpen(true)}
			>
				Rename{/* LOC */}
			</EuiButton>

			{isModalOpen && (
				<RenamePlaylistModal
					onCancel={(): void => setModalOpen(false)}
					onSave={async (): Promise<void> => {}}
				/>
			)}
		</>
	);
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
