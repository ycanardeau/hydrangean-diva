import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';
import { EuiConfirmModal } from '@elastic/eui';
import EasyModal, { type InnerModalProps } from 'ez-modal-react';
import { type ReactElement, useCallback, useState } from 'react';

interface DeletePlaylistConfirmModalProps extends InnerModalProps {
	playlistListItem: IPlaylistListItemStore;
}

export const DeletePlaylistConfirmModal = EasyModal.create(
	({
		remove,
		resolve,
		playlistListItem,
	}: DeletePlaylistConfirmModalProps): ReactElement => {
		const [loading, setLoading] = useState(false);

		const handleConfirm = useCallback(async (): Promise<void> => {
			try {
				setLoading(true);

				resolve();
				remove();
			} finally {
				setLoading(false);
			}
		}, [resolve, remove]);

		return (
			<EuiConfirmModal
				title="Delete playlist permanently?" /* LOC */
				onCancel={remove}
				onConfirm={handleConfirm}
				cancelButtonText="Cancel" /* LOC */
				confirmButtonText="Delete" /* LOC */
				buttonColor="danger"
				isLoading={loading}
			>
				<p>
					Are you sure you want to delete this playlist? If you delete
					'{playlistListItem.name}
					', you won't be able to recover it.{/* LOC */}
				</p>
			</EuiConfirmModal>
		);
	},
);
