import { AppPageTemplateHeader } from '@/common/components/AppPageTemplateHeader';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { PlayQueue } from '@/features/media-player.play-queue/components/PlayQueue';
import { PlayQueueTableStore } from '@/features/media-player.play-queue/stores/PlayQueueTableStore';
import { EuiPageTemplate } from '@elastic/eui';
import { type ReactElement, useState } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playQueue = usePlayQueue();

	const [playQueueTable] = useState(() => new PlayQueueTableStore());

	return (
		<>
			<AppPageTemplateHeader
				pageTitle="Play queue" /* LOC */
				rightSideItems={[]}
			/>

			<EuiPageTemplate.Section>
				<PlayQueue playQueue={playQueueTable} />
			</EuiPageTemplate.Section>
		</>
	);
};
