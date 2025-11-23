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
import { AddRegular } from '@fluentui/react-icons';
import { ReactElement, ReactNode, useCallback, useState } from 'react';

export interface CreatePlaylistFormSubmitEvent {
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

interface CreatePlaylistButtonProps {
	children?: ReactNode;
	onSave: (e: CreatePlaylistFormSubmitEvent) => Promise<void>;
}

export const CreatePlaylistButton = ({
	children,
	onSave,
}: CreatePlaylistButtonProps): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(
		async (e: CreatePlaylistFormSubmitEvent): Promise<void> => {
			await onSave(e);

			setModalOpen(false);
		},
		[onSave],
	);

	return (
		<>
			<EuiButton
				onClick={(): void => setModalOpen(true)}
				iconType={AddRegular}
				fill
			>
				{children}
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
