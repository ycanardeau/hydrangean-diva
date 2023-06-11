import { BottomBar } from '@/components/BottomBar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import { usePlayerStore } from '@/components/PlayerStoreContext';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const AppContainer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();
	const diva = useNostalgicDiva();

	React.useEffect(() => {
		return reaction(
			() => playerStore.currentItem,
			async (currentItem, previousItem) => {
				if (currentItem === undefined || previousItem === undefined) {
					return;
				}

				if (currentItem.id === previousItem.id) {
					await diva.setCurrentTime(0);
				}
			},
		);
	}, [playerStore, diva]);

	return (
		<>
			<PlayQueueTable />

			{!playerStore.isEmpty && <MiniPlayer />}

			<BottomBar />
		</>
	);
});
