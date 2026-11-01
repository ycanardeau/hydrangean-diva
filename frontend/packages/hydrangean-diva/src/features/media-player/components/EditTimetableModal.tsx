import { parseTimetable } from '@/features/media-player/helpers/parseTimetable';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiTextArea,
	useGeneratedHtmlId,
} from '@elastic/eui';
import EasyModal, { type InnerModalProps } from 'ez-modal-react';
import { type ReactElement, useState } from 'react';

export interface EditTimetableModalResult {
	text: string;
}

type EditTimetableModalProps = InnerModalProps<EditTimetableModalResult> & {
	text: string;
};

export const EditTimetableModal = EasyModal.create(
	({
		remove,
		resolve,
		text: initialText,
	}: EditTimetableModalProps): ReactElement => {
		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const [text, setText] = useState(initialText);

		const entryCount = parseTimetable(text).length;

		return (
			<EuiModal onClose={remove} initialFocus="[name=text]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Edit timetable{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={(e): void => {
							e.preventDefault();

							resolve({ text: text });
							remove();
						}}
					>
						<EuiFormRow
							label="Timetable" /* LOC */
							helpText={
								`Paste the video description or a list like "0:00 Song 1". Lines without a timestamp are ignored. ${entryCount} entries found.` /* LOC */
							}
						>
							<EuiTextArea
								name="text"
								rows={12}
								value={text}
								onChange={(e): void => setText(e.target.value)}
							/>
						</EuiFormRow>
					</EuiForm>
				</EuiModalBody>

				<EuiModalFooter>
					<EuiButtonEmpty onClick={remove}>
						Cancel{/* LOC */}
					</EuiButtonEmpty>

					<EuiButton type="submit" form={modalFormId} fill>
						Save{/* LOC */}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);
