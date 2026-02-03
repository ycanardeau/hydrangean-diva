import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

interface PlaylistDetailsPageProps {
	playlistId: string;
}

export const PlaylistDetailsPage = observer(
	({ playlistId }: PlaylistDetailsPageProps): ReactElement => {
		return <></>;
	},
);
