import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { PlayQueueContext } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { reaction } from 'mobx';
import React, {
	type ReactElement,
	type ReactNode,
	useEffect,
	useState,
} from 'react';

interface PlayQueueProviderProps {
	children?: ReactNode;
}

export const PlayQueueProvider = ({
	children,
}: PlayQueueProviderProps): ReactElement => {
	const [playQueue] = useState(
		() => new PlayQueueStore(new MobXObservableStateProvider()),
	);

	const diva = useNostalgicDiva();

	useEffect(() => {
		return reaction(
			() => playQueue.currentItem,
			async (currentItem, previousItem) => {
				if (currentItem === undefined || previousItem === undefined) {
					return;
				}

				if (
					currentItem.type === previousItem.type &&
					currentItem.videoId === previousItem.videoId
				) {
					await diva.setCurrentTime(0);
				}
			},
		);
	}, [playQueue, diva]);

	return (
		<PlayQueueContext.Provider value={playQueue}>
			{children}
		</PlayQueueContext.Provider>
	);
};
