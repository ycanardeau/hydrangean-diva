import { PlayQueueItemStoreFactory } from '@/factories/PlayQueueItemStoreFactory';
import { PlayQueueStoreFactory } from '@/factories/PlayQueueStoreFactory';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayQueueStoreContext = React.createContext<PlayQueueStore>(undefined!);

interface PlayQueueStoreProviderProps {
	children?: React.ReactNode;
}

const playQueueItemStoreFactory = new PlayQueueItemStoreFactory();
const playQueueStoreFactory = new PlayQueueStoreFactory(
	playQueueItemStoreFactory,
);

export const PlayQueueStoreProvider = ({
	children,
}: PlayQueueStoreProviderProps): React.ReactElement => {
	const [playQueueStore] = React.useState(() =>
		playQueueStoreFactory.create(),
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
