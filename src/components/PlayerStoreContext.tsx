import { PlayerStore } from '@/stores/PlayerStore';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayerStoreContext = React.createContext<PlayerStore>(undefined!);

interface PlayerStoreProviderProps {
	children?: React.ReactNode;
}

export const PlayerStoreProvider = ({
	children,
}: PlayerStoreProviderProps): React.ReactElement => {
	const [playerStore] = React.useState(() => new PlayerStore());

	return (
		<PlayerStoreContext.Provider value={playerStore}>
			{children}
		</PlayerStoreContext.Provider>
	);
};

export const usePlayerStore = (): PlayerStore => {
	return React.useContext(PlayerStoreContext);
};
