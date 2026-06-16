import { usePlayQueue } from '@/features/media-player/contexts/PlayQueueContext';
import { bottomBarHeight } from '@/features/media-player/helpers/bottomBarHeight';
import { miniPlayerSize } from '@/features/media-player/helpers/miniPlayerSize';
import { EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement, type ReactNode } from 'react';

interface MediaPlayerLayoutProps {
	children?: ReactNode;
}

export const MediaPlayerLayout = observer(
	({ children }: MediaPlayerLayoutProps): ReactElement => {
		const playQueue = usePlayQueue();

		return (
			<EuiPageTemplate
				panelled
				style={{
					minBlockSize: `max(460px, 100vh - ${bottomBarHeight}px)`,
				}}
			>
				{children}

				{!playQueue.isEmpty && (
					<EuiSpacer style={{ blockSize: miniPlayerSize.height }} />
				)}
			</EuiPageTemplate>
		);
	},
);
