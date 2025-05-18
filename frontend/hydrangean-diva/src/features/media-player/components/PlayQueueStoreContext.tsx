import { MobXObservableStateProvider } from '@/features/media-player/stores/MobXObservableStateProvider';
import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayQueueStoreContext = React.createContext<PlayQueueStore>(undefined!);

interface PlayQueueStoreProviderProps {
	children?: React.ReactNode;
}

export const PlayQueueStoreProvider = ({
	children,
}: PlayQueueStoreProviderProps): React.ReactElement => {
	const [playQueueStore] = React.useState(
		() => new PlayQueueStore(new MobXObservableStateProvider()),
	);

	return (
		<PlayQueueStoreContext.Provider value={playQueueStore}>
			{children}
		</PlayQueueStoreContext.Provider>
	);
};

export const usePlayQueueStore = (): PlayQueueStore => {
	return React.useContext(PlayQueueStoreContext);
};
