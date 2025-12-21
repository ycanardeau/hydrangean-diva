import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { PlayerStore } from '@/features/media-player.player/stores/PlayerStore';
import React, {
	ReactElement,
	ReactNode,
	createContext,
	useContext,
	useState,
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayerStoreContext = createContext<IPlayerStore>(undefined!);

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

export const usePlayerStore = (): IPlayerStore => {
	return useContext(PlayerStoreContext);
};
