import {
	EuiButton,
	EuiButtonEmpty,
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
import { ReactElement, useCallback, useState } from 'react';

interface CreatePlaylistFormSubmitEvent {
	name: string;
}

interface CreatePlaylistModalProps {
	onCancel: () => void;
	onSave: (e: CreatePlaylistFormSubmitEvent) => Promise<void>;
}

const CreatePlaylistModal = ({
	onCancel,
	onSave,
}: CreatePlaylistModalProps): ReactElement => {
	const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<EuiModal onClose={onCancel} initialFocus="[name=name]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create playlist{/* LOC */}
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
					Create playlist{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};

export const CreatePlaylistButton = (): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(async (): Promise<void> => {
		setModalOpen(false);
	}, []);

	return (
		<>
			<EuiButton onClick={(): void => setModalOpen(true)}>
				Create playlist{/* LOC */}
			</EuiButton>

			{isModalOpen && (
				<CreatePlaylistModal
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};
