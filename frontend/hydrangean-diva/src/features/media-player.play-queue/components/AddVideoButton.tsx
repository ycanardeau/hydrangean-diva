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
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import React, { memo, ReactElement, useCallback, useState } from 'react';

export interface AddVideoFormSubmitEvent {
	url: string;
	title: string;
}

interface AddVideoModalProps {
	onCancel: () => void;
	onSave: (e: AddVideoFormSubmitEvent) => Promise<void>;
}

const AddVideoModal = ({
	onCancel,
	onSave,
}: AddVideoModalProps): ReactElement => {
	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<EuiModal onClose={onCancel} initialFocus="[name=url]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>Add video{/* LOC */}</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<EuiForm component="form">
					<EuiFormRow label="URL" /* LOC */>
						<EuiFieldText
							name="url"
							value={url}
							onChange={(e): void => setUrl(e.target.value)}
						/>
					</EuiFormRow>

					<EuiFormRow label="Title">
						<EuiFieldText
							name="title"
							value={title}
							onChange={(e): void => setTitle(e.target.value)}
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
					onClick={async (): Promise<void> => {
						try {
							setLoading(true);

							await onSave({ url, title });
						} finally {
							setLoading(false);
						}
					}}
					fill
					disabled={url.trim().length === 0}
					isLoading={loading}
				>
					Add video{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};

interface AddVideoButtonProps {
	onSave: (e: AddVideoFormSubmitEvent) => Promise<void>;
}

export const AddVideoButton = memo(
	({ onSave }: AddVideoButtonProps): ReactElement => {
		const [isModalOpen, setModalOpen] = useState(false);

		const handleSave = useCallback(
			async (e: AddVideoFormSubmitEvent): Promise<void> => {
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
					color="primary"
				>
					Add video{/* LOC */}
				</EuiButton>

				{isModalOpen && (
					<AddVideoModal
						onCancel={(): void => setModalOpen(false)}
						onSave={handleSave}
					/>
				)}
			</>
		);
	},
);
