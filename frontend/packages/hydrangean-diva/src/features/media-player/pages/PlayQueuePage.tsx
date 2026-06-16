import { PlayQueueSection } from '@/features/media-player/components/PlayQueueSection';
import { usePlayQueue } from '@/features/media-player/contexts/PlayQueueContext';
import { AppPageTemplateHeader } from '@/shared/components/AppPageTemplateHeader';
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
