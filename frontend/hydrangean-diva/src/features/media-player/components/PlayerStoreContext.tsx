import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useState,
} from 'react';

import { MobXObservableStateProvider } from '@/features/media-player/stores/MobXObservableStateProvider';
import { PlayerStore } from '@/features/media-player/stores/PlayerStore';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayerStoreContext = createContext<PlayerStore>(undefined!);

interface PlayerStoreProviderProps {
	children?: ReactNode;
}

export const PlayerStoreProvider = ({
	children,
}: PlayerStoreProviderProps): ReactElement => {
	const [playerStore] = useState(
		() => new PlayerStore(new MobXObservableStateProvider()),
	);

	return (
		<PlayerStoreContext.Provider value={playerStore}>
			{children}
		</PlayerStoreContext.Provider>
	);
};

export const usePlayerStore = (): PlayerStore => {
	return useContext(PlayerStoreContext);
};
