import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { usePlayQueueStore } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueStoreContext';
import { PlayQueue } from '@/features/media-player.play-queue/components/PlayQueue';
import { EuiPageTemplate, useEuiTheme } from '@elastic/eui';
import { ReactElement } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playQueueStore = usePlayQueueStore();
	const { euiTheme } = useEuiTheme();

	return (
		<>
			<AppPageTemplateHeader
				style={{
					paddingLeft: `calc(env(safe-area-inset-left) + ${euiTheme.size.l}px)`,
					paddingRight: `calc(env(safe-area-inset-right) + ${euiTheme.size.l}px)`,
				}}
				pageTitle="Play queue" /* LOC */
				rightSideItems={[]}
			/>

			<EuiPageTemplate.Section
				style={{
					paddingLeft: `calc(env(safe-area-inset-left) + ${euiTheme.size.l}px)`,
					paddingRight: `calc(env(safe-area-inset-right) + ${euiTheme.size.l}px)`,
				}}
			>
				<PlayQueue playQueueStore={playQueueStore} />
			</EuiPageTemplate.Section>
		</>
	);
};
