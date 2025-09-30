import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { usePlayQueueStore } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueStoreContext';
import { PlayQueue } from '@/features/media-player.play-queue/components/PlayQueue';
import { EuiPageTemplate } from '@elastic/eui';
import { ReactElement } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playQueueStore = usePlayQueueStore();

	return (
		<>
			<AppPageTemplateHeader
				style={{
					paddingLeft: 'calc(env(safe-area-inset-left) + 24px)',
					paddingRight: 'calc(env(safe-area-inset-right) + 24px)',
				}}
				pageTitle="Play queue" /* LOC */
				rightSideItems={[]}
			/>

			<EuiPageTemplate.Section
				style={{
					paddingLeft: 'calc(env(safe-area-inset-left) + 24px)',
					paddingRight: 'calc(env(safe-area-inset-right) + 24px)',
				}}
			>
				<PlayQueue playQueueStore={playQueueStore} />
			</EuiPageTemplate.Section>
		</>
	);
};
