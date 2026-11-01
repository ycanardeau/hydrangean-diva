import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldPassword,
	EuiForm,
	EuiFormRow,
	EuiLink,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	useGeneratedHtmlId,
} from '@elastic/eui';
import EasyModal, { type InnerModalProps } from 'ez-modal-react';
import { type ReactElement, useState } from 'react';

export interface SettingsModalResult {
	youTubeApiKey: string;
}

type SettingsModalProps = InnerModalProps<SettingsModalResult> & {
	youTubeApiKey: string;
};

export const SettingsModal = EasyModal.create(
	({
		remove,
		resolve,
		youTubeApiKey: initialYouTubeApiKey,
	}: SettingsModalProps): ReactElement => {
		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const [youTubeApiKey, setYouTubeApiKey] =
			useState(initialYouTubeApiKey);

		return (
			<EuiModal onClose={remove} initialFocus="[name=youTubeApiKey]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Settings{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={(e): void => {
							e.preventDefault();

							resolve({ youTubeApiKey: youTubeApiKey.trim() });
							remove();
						}}
					>
						<EuiFormRow
							label="YouTube Data API key" /* LOC */
							helpText={
								<>
									Used to fetch timetables from YouTube video
									descriptions. The key is stored only in this
									browser.{' '}
									<EuiLink
										href="https://developers.google.com/youtube/v3/getting-started"
										target="_blank"
									>
										How to get a key
									</EuiLink>
									{/* LOC */}
								</>
							}
						>
							<EuiFieldPassword
								name="youTubeApiKey"
								type="dual"
								autoComplete="off"
								value={youTubeApiKey}
								onChange={(e): void =>
									setYouTubeApiKey(e.target.value)
								}
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
