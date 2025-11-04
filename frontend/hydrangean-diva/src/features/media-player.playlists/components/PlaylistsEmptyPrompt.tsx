import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';
import { Cd16Regular } from '@fluentui/react-icons';
import { ReactElement } from 'react';

export const PlaylistsEmptyPrompt = (): ReactElement => {
	return (
		<EuiEmptyPrompt
			iconType={Cd16Regular}
			title={<h2>You don't have any playlists{/* LOC */}</h2>}
			actions={<EuiButton>Create playlist{/* LOC */}</EuiButton>}
		/>
	);
};
