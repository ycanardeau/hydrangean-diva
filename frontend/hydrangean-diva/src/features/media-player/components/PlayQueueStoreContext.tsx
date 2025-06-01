import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { reaction } from 'mobx';
import React, {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

import { MobXObservableStateProvider } from '@/features/media-player/stores/MobXObservableStateProvider';
import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayQueueStoreContext = createContext<PlayQueueStore>(undefined!);

interface PlayQueueStoreProviderProps {
	children?: ReactNode;
}

export const PlayQueueStoreProvider = ({
	children,
}: PlayQueueStoreProviderProps): ReactElement => {
	const [playQueueStore] = useState(
		() => new PlayQueueStore(new MobXObservableStateProvider()),
	);

	const diva = useNostalgicDiva();

	useEffect(() => {
		return reaction(
			() => playQueueStore.currentItem,
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
	}, [playQueueStore, diva]);

	return (
		<PlayQueueStoreContext.Provider value={playQueueStore}>
			{children}
		</PlayQueueStoreContext.Provider>
	);
};

export const usePlayQueueStore = (): PlayQueueStore => {
	return useContext(PlayQueueStoreContext);
};
