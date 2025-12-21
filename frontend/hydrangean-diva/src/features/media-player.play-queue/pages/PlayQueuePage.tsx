import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { PlayQueue } from '@/features/media-player.play-queue/components/PlayQueue';
import { usePlayQueueStore } from '@/features/media-player.play-queue/components/PlayQueueStoreContext';
import { EuiPageTemplate } from '@elastic/eui';
import { ReactElement } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playQueueStore = usePlayQueueStore();

	return (
		<>
			<AppPageTemplateHeader
				pageTitle="Play queue" /* LOC */
				rightSideItems={[]}
			/>

			<EuiPageTemplate.Section>
				<PlayQueue playQueueStore={playQueueStore} />
			</EuiPageTemplate.Section>
		</>
	);
};
