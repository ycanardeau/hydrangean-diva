import { CreatePlaylistModal } from '@/features/media-player.playlists/components/CreatePlaylistModal';
import { EuiButton } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import EasyModal from 'ez-modal-react';
import { type ReactElement, type ReactNode } from 'react';

interface CreatePlaylistButtonProps {
	children?: ReactNode;
	onFulfilled: (value: string) => Promise<void>;
}

export const CreatePlaylistButton = ({
	children,
	onFulfilled,
}: CreatePlaylistButtonProps): ReactElement => {
	const handleClick = (): Promise<void> =>
		EasyModal.show(CreatePlaylistModal).then(onFulfilled);

	return (
		<EuiButton onClick={handleClick} iconType={AddRegular} fill>
			{children}
		</EuiButton>
	);
};
