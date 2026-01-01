import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { PlayQueue } from '@/features/media-player.play-queue/components/PlayQueue';
import { EuiPageTemplate } from '@elastic/eui';
import type { ReactElement } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playQueue = usePlayQueue();

	return (
		<>
			<AppPageTemplateHeader
				pageTitle="Play queue" /* LOC */
				rightSideItems={[]}
			/>

			<EuiPageTemplate.Section>
				<PlayQueue playQueue={playQueue} />
			</EuiPageTemplate.Section>
		</>
	);
};
