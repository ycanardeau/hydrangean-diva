import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
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

	return (
		<PlayQueueStoreContext.Provider value={playQueueStore}>
			{children}
		</PlayQueueStoreContext.Provider>
	);
};

export const usePlayQueueStore = (): PlayQueueStore => {
	return useContext(PlayQueueStoreContext);
};
