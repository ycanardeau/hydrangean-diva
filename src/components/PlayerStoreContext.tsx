import { PlayerStoreFactory } from '@/factories/PlayerStoreFactory';
import { PlayerStore } from '@/stores/PlayerStore';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PlayerStoreContext = React.createContext<PlayerStore>(undefined!);

interface PlayerStoreProviderProps {
	children?: React.ReactNode;
}

const playerStoreFactory = new PlayerStoreFactory();

export const PlayerStoreProvider = ({
	children,
}: PlayerStoreProviderProps): React.ReactElement => {
	const [playerStore] = React.useState(() => playerStoreFactory.create());

	return (
		<PlayerStoreContext.Provider value={playerStore}>
			{children}
		</PlayerStoreContext.Provider>
	);
};

export const usePlayerStore = (): PlayerStore => {
	return React.useContext(PlayerStoreContext);
};
