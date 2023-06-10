import { BottomBar } from '@/components/BottomBar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import { usePlayerStore } from '@/components/PlayerStoreContext';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const AppContainer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();

	React.useEffect(() => {
		return reaction(
			() => playerStore.currentItem,
			() => playerStore.setPlaying(false),
		);
	}, [playerStore]);

	return (
		<>
			<PlayQueueTable />

			{!playerStore.isEmpty && <MiniPlayer />}

			<BottomBar />
		</>
	);
});
