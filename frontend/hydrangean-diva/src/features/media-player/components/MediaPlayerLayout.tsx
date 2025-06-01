import { EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, ReactNode } from 'react';

import { bottomBarHeight } from '@/features/media-player/components/BottomBar';
import { miniPlayerSize } from '@/features/media-player/components/MiniPlayer';
import { usePlayQueueStore } from '@/features/media-player/components/PlayQueueStoreContext';

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
