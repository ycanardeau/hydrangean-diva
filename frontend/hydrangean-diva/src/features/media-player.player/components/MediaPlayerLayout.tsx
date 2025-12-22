import { bottomBarHeight } from '@/features/common/helpers/bottomBarHeight';
import { miniPlayerSize } from '@/features/common/helpers/miniPlayerSize';
import { usePlayQueueStore } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueStoreContext';
import { EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, ReactNode } from 'react';

interface MediaPlayerLayoutProps {
	children?: ReactNode;
}

export const MediaPlayerLayout = observer(
	({ children }: MediaPlayerLayoutProps): ReactElement => {
		const playQueueStore = usePlayQueueStore();

		return (
			<EuiPageTemplate
				panelled
				style={{
					minBlockSize: `max(460px, 100vh - ${bottomBarHeight}px)`,
				}}
			>
				{children}

				{!playQueueStore.isEmpty && (
					<EuiSpacer style={{ blockSize: miniPlayerSize.height }} />
				)}
			</EuiPageTemplate>
		);
	},
);
