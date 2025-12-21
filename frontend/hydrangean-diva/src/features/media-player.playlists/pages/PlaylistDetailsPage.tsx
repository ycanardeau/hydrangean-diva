import { HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto } from '@/api';
import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { useLocationStateStore } from '@/features/common/components/useLocationStateHandler';
import { PlaylistTable } from '@/features/media-player.playlists/components/PlaylistTable';
import { mediaPlayerPlaylistsApi } from '@/features/media-player.playlists/helpers/mediaPlayerPlaylistsApi';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiConfirmModal,
	EuiFieldText,
	EuiFlexGroup,
	EuiFlexItem,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiPageTemplate,
	EuiSpacer,
	useEuiTheme,
	useGeneratedHtmlId,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
	PlayRegular,
	RenameRegular,
} from '@fluentui/react-icons';
import { useRouter } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { ReactElement, useCallback, useState } from 'react';

const PlayButton = (): ReactElement => {
	return (
		<EuiButton iconType={PlayRegular} fill>
			Play{/* LOC */}
		</EuiButton>
	);
};

const PlayNextButton = (): ReactElement => {
	return <EuiButton>Play next{/* LOC */}</EuiButton>;
};

const AddToPlayQueueButton = (): ReactElement => {
	return (
		<EuiButton iconType={AddRegular}>
			Add to play queue{/* LOC */}
		</EuiButton>
	);
};

const RemoveButton = (): ReactElement => {
	return <EuiButton iconType={DismissRegular}>Remove{/* LOC */}</EuiButton>;
};

interface RenamePlaylistFormSubmitEvent {
	id: string;
	name: string;
}

interface RenamePlaylistModalProps {
	playlist: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto;
	onCancel: () => void;
	onSave: (e: RenamePlaylistFormSubmitEvent) => Promise<void>;
}

const RenamePlaylistModal = ({
	playlist,
	onCancel,
	onSave,
}: RenamePlaylistModalProps): ReactElement => {
	const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

	const [name, setName] = useState(playlist.name);
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

							await onSave({
								id: playlist.id,
								name: name,
							});
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
	playlist: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto;
	onSave: (e: RenamePlaylistFormSubmitEvent) => Promise<void>;
}

const RenameButton = ({
	playlist,
	onSave,
}: RenameButtonProps): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(
		async (e: RenamePlaylistFormSubmitEvent): Promise<void> => {
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
					playlist={playlist}
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};

interface DeletePlaylistFormSubmitEvent {
	id: string;
}

interface DeletePlaylistConfirmModalProps {
	playlist: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto;
	onCancel: () => void;
	onSave: (e: DeletePlaylistFormSubmitEvent) => Promise<void>;
}

const DeletePlaylistConfirmModal = ({
	playlist,
	onCancel,
	onSave,
}: DeletePlaylistConfirmModalProps): ReactElement => {
	const [loading, setLoading] = useState(false);

	const handleConfirm = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);

			await onSave({
				id: playlist.id,
			});
		} finally {
			setLoading(false);
		}
	}, [playlist, onSave]);

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
				{playlist.name}', you won't be able to recover it.{/* LOC */}
			</p>
		</EuiConfirmModal>
	);
};

interface DeleteButtonProps {
	playlist: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto;
	onSave: (e: DeletePlaylistFormSubmitEvent) => Promise<void>;
}

const DeleteButton = ({
	playlist,
	onSave,
}: DeleteButtonProps): ReactElement => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSave = useCallback(
		async (e: DeletePlaylistFormSubmitEvent): Promise<void> => {
			await onSave(e);

			setModalOpen(false);
		},
		[onSave],
	);

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
					playlist={playlist}
					onCancel={(): void => setModalOpen(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
};

interface PlaylistDetailsPageProps {
	playlist: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto;
	playlistStore: PlaylistStore;
}

export const PlaylistDetailsPage = observer(
	({ playlist, playlistStore }: PlaylistDetailsPageProps): ReactElement => {
		useLocationStateStore(playlistStore);

		const { euiTheme } = useEuiTheme();

		const router = useRouter();

		const handleRenamePlaylist = useCallback(
			async (e: RenamePlaylistFormSubmitEvent): Promise<void> => {
				await mediaPlayerPlaylistsApi.mediaPlayerPlaylistsIdRenamePost({
					id: e.id,
					hydrangeanDivaMediaPlayerEndpointsPlaylistsRenamePlaylistRequest:
						{
							name: e.name,
						},
				});

				await router.invalidate();
			},
			[router],
		);

		const handleDeletePlaylist = useCallback(
			async (e: DeletePlaylistFormSubmitEvent): Promise<void> => {
				await mediaPlayerPlaylistsApi.mediaPlayerPlaylistsIdDelete({
					id: e.id,
				});

				await router.navigate({ to: '/playlists' });
			},
			[router],
		);

		return (
			<>
				<AppPageTemplateHeader
					pageTitle={playlist.name}
					breadcrumbs={[
						{
							text: 'Playlists' /* LOC */,
							linkProps: {
								to: '/playlists',
							},
						},
						{
							text: playlist.name,
						},
					]}
					description={`${0} items`}
					rightSideItems={[
						<RenameButton
							playlist={playlist}
							onSave={handleRenamePlaylist}
						/>,
						<DeleteButton
							playlist={playlist}
							onSave={handleDeletePlaylist}
						/>,
					]}
				/>

				<EuiPageTemplate.Section>
					<EuiFlexGroup
						alignItems="center"
						gutterSize="m"
						style={{
							position: 'sticky',
							top: 48,
							zIndex: 998,
							background: euiTheme.colors.backgroundBasePlain,
						}}
					>
						<EuiFlexItem grow={false}>
							<PlayButton />
						</EuiFlexItem>
						<EuiFlexItem grow={false}>
							<PlayNextButton />
						</EuiFlexItem>
						<EuiFlexItem grow={false}>
							<AddToPlayQueueButton />
						</EuiFlexItem>
						<EuiFlexItem grow={false}>
							<RemoveButton />
						</EuiFlexItem>
					</EuiFlexGroup>

					<EuiSpacer
						size="l"
						style={{
							position: 'sticky',
							top: 48 + 40,
							zIndex: 998,
							background: euiTheme.colors.backgroundBasePlain,
						}}
					/>

					<PlaylistTable playlistStore={playlistStore} />
				</EuiPageTemplate.Section>
			</>
		);
	},
);
