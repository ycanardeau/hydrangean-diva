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

interface AddVideoModalProps {
	onCancel: () => void;
	onSave: () => void;
}

export const AddVideoModal = ({
	onCancel,
	onSave,
}: AddVideoModalProps): React.ReactElement => {
	return (
		<EuiModal onClose={onCancel} initialFocus="[name=url]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>Add video{/* LOC */}</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<EuiForm component="form">
					<EuiFormRow label="URL" /* LOC */>
						<EuiFieldText name="url" />
					</EuiFormRow>

					<EuiFormRow label="Title">
						<EuiFieldText name="title" />
					</EuiFormRow>
				</EuiForm>
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButtonEmpty onClick={onCancel}>
					Cancel{/* LOC */}
				</EuiButtonEmpty>

				<EuiButton type="submit" onClick={onSave} fill>
					Save{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};
