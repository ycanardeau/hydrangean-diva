import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { localStorageStateKeys } from '@/features/common/stores/localStorageStateKeys';
import { PlaylistSection } from '@/features/media-player.playlists/components/PlaylistSection';
import type { PlaylistListItemStore } from '@/features/media-player.playlists/stores/PlaylistListStore';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { useLocalStorageState } from '@aigamo/route-sphere';
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
import {
	DeleteRegular,
	PlayRegular,
	RenameRegular,
} from '@fluentui/react-icons';
import { useRouter } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useCallback, useState } from 'react';

interface PlayAllButtonProps {
	onClick: () => Promise<void>;
}

const PlayAllButton = ({ onClick }: PlayAllButtonProps): ReactElement => {
	return (
		<EuiButton onClick={onClick} iconType={PlayRegular} fill>
			Play all{/* LOC */}
		</EuiButton>
	);
};

interface RenamePlaylistModalProps {
	playlistListItem: PlaylistListItemStore;
	onCancel: () => void;
	onSave: (e: { name: string }) => Promise<void>;
}

const RenamePlaylistModal = ({
	playlistListItem,
	onCancel,
	onSave,
}: RenamePlaylistModalProps): ReactElement => {
	const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

	const [name, setName] = useState(playlistListItem.name);
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

							await onSave({ name: name });
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
	playlistListItem: PlaylistListItemStore;
	onSave: (e: { name: string }) => Promise<void>;
}

const RenameButton = ({
	playlistListItem,
	onSave,
}: RenameButtonProps): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(
		async (e: { name: string }): Promise<void> => {
			await onSave(e);

			setModalOpen(false);
		},
		[onSave],
	);

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
					playlistListItem={playlistListItem}
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};

interface DeletePlaylistConfirmModalProps {
	playlistListItem: PlaylistListItemStore;
	onCancel: () => void;
	onSave: () => Promise<void>;
}

const DeletePlaylistConfirmModal = ({
	playlistListItem,
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
				Are you sure you want to delete this playlist? If you delete '
				{playlistListItem.name}
				', you won't be able to recover it.{/* LOC */}
			</p>
		</EuiConfirmModal>
	);
};

interface DeleteButtonProps {
	playlistListItem: PlaylistListItemStore;
	onSave: () => Promise<void>;
}

const DeleteButton = ({
	playlistListItem,
	onSave,
}: DeleteButtonProps): ReactElement => {
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
					playlistListItem={playlistListItem}
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};

interface PlaylistDetailsPageProps {
	playlistListItem: PlaylistListItemStore;
}

export const PlaylistDetailsPage = observer(
	({ playlistListItem }: PlaylistDetailsPageProps): ReactElement => {
		const localStorageStateKey = localStorageStateKeys.playlist(
			playlistListItem.id,
		);

		const [playlist] = useState(() => new PlaylistStore());

		useLocalStorageState(localStorageStateKey, playlist.localStorageState);

		const router = useRouter();

		const handleClickPlayAllButton =
			useCallback(async (): Promise<void> => {}, []);

		const handleClickRenameButton = useCallback(
			async (e: { name: string }): Promise<void> => {
				await playlistListItem.rename(e.name);
			},
			[playlistListItem],
		);

		const handleClickDeleteButton = useCallback(async (): Promise<void> => {
			await router.navigate({ to: '/playlists' });

			window.localStorage.removeItem(localStorageStateKey);

			await playlistListItem.remove();
		}, [playlistListItem, router, localStorageStateKey]);

		return (
			<>
				<AppPageTemplateHeader
					pageTitle={playlistListItem.name}
					breadcrumbs={[
						{
							text: 'Playlists' /* LOC */,
							linkProps: {
								to: '/playlists',
							},
						},
						{
							text: playlistListItem.name,
						},
					]}
					rightSideItems={[
						<PlayAllButton onClick={handleClickPlayAllButton} />,
						<RenameButton
							playlistListItem={playlistListItem}
							onSave={handleClickRenameButton}
						/>,
						<DeleteButton
							playlistListItem={playlistListItem}
							onSave={handleClickDeleteButton}
						/>,
					]}
				/>

				<PlaylistSection playlist={playlist} />
			</>
		);
	},
);
