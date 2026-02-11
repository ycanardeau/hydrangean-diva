import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { PlayQueueSection } from '@/features/media-player.play-queue/components/PlayQueueSection';
import type { ReactElement } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playQueue = usePlayQueue();

	return (
		<>
			<AppPageTemplateHeader
				pageTitle="Play queue" /* LOC */
				rightSideItems={[]}
			/>

			<PlayQueueSection playQueue={playQueue} />
		</>
	);
};
