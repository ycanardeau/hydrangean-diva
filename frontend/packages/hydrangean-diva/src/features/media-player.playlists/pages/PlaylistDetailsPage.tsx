import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiConfirmModal,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { DeleteRegular, RenameRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useCallback, useState } from 'react';

interface RenamePlaylistModalProps {
	onCancel: () => void;
	onSave: () => Promise<void>;
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

							await onSave();
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

interface RenameButtonProps {
	onSave: () => Promise<void>;
}

const RenameButton = ({ onSave }: RenameButtonProps): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(async (): Promise<void> => {
		await onSave();

		setModalOpen(false);
	}, [onSave]);

	return (
		<>
			<EuiButton
				onClick={(): void => setModalOpen(true)}
				iconType={RenameRegular}
			>
				Rename{/* LOC */}
			</EuiButton>

			{isModalOpen && (
				<RenamePlaylistModal
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};

interface DeletePlaylistConfirmModalProps {
	onCancel: () => void;
	onSave: () => Promise<void>;
}

const DeletePlaylistConfirmModal = ({
	onCancel,
	onSave,
}: DeletePlaylistConfirmModalProps): ReactElement => {
	const [loading, setLoading] = useState(false);

	const handleConfirm = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);

			await onSave();
		} finally {
			setLoading(false);
		}
	}, [onSave]);

	return (
		<EuiConfirmModal
			title="Delete playlist permanently?" /* LOC */
			onCancel={onCancel}
			onConfirm={handleConfirm}
			cancelButtonText="Cancel" /* LOC */
			confirmButtonText="Delete" /* LOC */
			buttonColor="danger"
			isLoading={loading}
		>
			<p>
				Are you sure you want to delete this playlist? If you delete '{}
				', you won't be able to recover it.{/* LOC */}
			</p>
		</EuiConfirmModal>
	);
};

interface DeleteButtonProps {
	onSave: () => Promise<void>;
}

const DeleteButton = ({ onSave }: DeleteButtonProps): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(async (): Promise<void> => {
		await onSave();

		setModalOpen(false);
	}, [onSave]);

	return (
		<>
			<EuiButton
				onClick={(): void => setModalOpen(true)}
				iconType={DeleteRegular}
			>
				Delete{/* LOC */}
			</EuiButton>

			{isModalOpen && (
				<DeletePlaylistConfirmModal
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};

interface PlaylistDetailsPageProps {
	playlistId: string;
}

export const PlaylistDetailsPage = observer(
	({ playlistId }: PlaylistDetailsPageProps): ReactElement => {
		return (
			<>
				<AppPageTemplateHeader
					rightSideItems={[
						<RenameButton onSave={async () => {}} />,
						<DeleteButton onSave={async () => {}} />,
					]}
				/>
			</>
		);
	},
);
