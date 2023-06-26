import {
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModalHeader,
} from '@elastic/eui';
import { EuiModalFooter } from '@elastic/eui';
import { EuiButton } from '@elastic/eui';
import { EuiButtonEmpty } from '@elastic/eui';
import { EuiModalBody } from '@elastic/eui';
import { EuiModalHeaderTitle } from '@elastic/eui';
import { EuiModal } from '@elastic/eui';
import React from 'react';

interface AddVideoModalProps {
	onCancel: () => void;
	onSave: (e: { url: string; title: string }) => Promise<void>;
}

export const AddVideoModal = ({
	onCancel,
	onSave,
}: AddVideoModalProps): React.ReactElement => {
	const [url, setUrl] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [loading, setLoading] = React.useState(false);

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
					Save{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};
