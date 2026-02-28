import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { localStorageStateKeys } from '@/features/common/stores/localStorageStateKeys';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';
import { DeletePlaylistConfirmModal } from '@/features/media-player.playlists/components/DeletePlaylistConfirmModal';
import { PlaylistSection } from '@/features/media-player.playlists/components/PlaylistSection';
import { RenamePlaylistModal } from '@/features/media-player.playlists/components/RenamePlaylistModal';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { EuiButton } from '@elastic/eui';
import {
	DeleteRegular,
	PlayRegular,
	RenameRegular,
} from '@fluentui/react-icons';
import { useRouter } from '@tanstack/react-router';
import EasyModal from 'ez-modal-react';
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

interface RenameButtonProps {
	playlistListItem: IPlaylistListItemStore;
	onFulfilled: (value: string) => Promise<void>;
}

const RenameButton = ({
	playlistListItem,
	onFulfilled,
}: RenameButtonProps): ReactElement => {
	const handleClick = (): Promise<void> =>
		EasyModal.show(RenamePlaylistModal, {
			playlistListItem: playlistListItem,
		}).then(onFulfilled);

	return (
		<EuiButton onClick={handleClick} iconType={RenameRegular}>
			Rename{/* LOC */}
		</EuiButton>
	);
};

interface DeleteButtonProps {
	playlistListItem: IPlaylistListItemStore;
	onFulfilled: () => Promise<void>;
}

const DeleteButton = ({
	playlistListItem,
	onFulfilled,
}: DeleteButtonProps): ReactElement => {
	const handleClick = (): Promise<void> =>
		EasyModal.show(DeletePlaylistConfirmModal, {
			playlistListItem: playlistListItem,
		}).then(onFulfilled);

	return (
		<EuiButton onClick={handleClick} iconType={DeleteRegular}>
			Delete{/* LOC */}
		</EuiButton>
	);
};

interface PlaylistDetailsPageProps {
	playlistListItem: IPlaylistListItemStore;
}

export const PlaylistDetailsPage = observer(
	({ playlistListItem }: PlaylistDetailsPageProps): ReactElement => {
		const localStorageStateKey = localStorageStateKeys.playlist(
			playlistListItem.id,
		);

		const playQueue = usePlayQueue();

		const [playlist] = useState(() => new PlaylistStore(playQueue));

		useLocalStorageState(localStorageStateKey, playlist.localStorageState);

		const router = useRouter();

		const handleClickRenameButton = useCallback(
			async (value: string): Promise<void> => {
				await playlistListItem.rename(value);
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
						<PlayAllButton onClick={playlist.playAll} />,
						<RenameButton
							playlistListItem={playlistListItem}
							onFulfilled={handleClickRenameButton}
						/>,
						<DeleteButton
							playlistListItem={playlistListItem}
							onFulfilled={handleClickDeleteButton}
						/>,
					]}
				/>

				<PlaylistSection playlist={playlist} />
			</>
		);
	},
);
