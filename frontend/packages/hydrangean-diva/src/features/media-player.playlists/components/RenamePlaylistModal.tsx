import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';
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
import EasyModal, { type InnerModalProps } from 'ez-modal-react';
import { type ReactElement, useState } from 'react';

interface RenamePlaylistModalProps extends InnerModalProps<string> {
	playlistListItem: IPlaylistListItemStore;
}

export const RenamePlaylistModal = EasyModal.create(
	({
		remove,
		resolve,
		playlistListItem,
	}: RenamePlaylistModalProps): ReactElement => {
		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const [name, setName] = useState(playlistListItem.name);
		const [loading, setLoading] = useState(false);

		return (
			<EuiModal onClose={remove} initialFocus="[name=name]">
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

								resolve(name);
								remove();
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
					<EuiButtonEmpty onClick={remove}>
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
	},
);
