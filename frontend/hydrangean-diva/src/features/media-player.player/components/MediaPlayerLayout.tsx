import { bottomBarHeight } from '@/features/common/helpers/bottomBarHeight';
import { miniPlayerSize } from '@/features/common/helpers/miniPlayerSize';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React, { type ReactElement, type ReactNode } from 'react';

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
