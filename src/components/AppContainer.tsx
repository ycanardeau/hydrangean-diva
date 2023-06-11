import { BottomBar } from '@/components/BottomBar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import { usePlayerStore } from '@/components/PlayerStoreContext';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const AppContainer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();
	const diva = useNostalgicDiva();

	React.useEffect(() => {
		return reaction(
			() => playerStore.playQueueStore.currentItem,
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
			<EuiFlexGroup alignItems="center" gutterSize="m">
				<EuiFlexItem grow={false}>
					<EuiButton
						onClick={(): void => playerStore.playQueueStore.clear()}
					>
						Clear{/* LOC */}
					</EuiButton>
				</EuiFlexItem>
			</EuiFlexGroup>

			<EuiSpacer size="l" />

			<PlayQueueTable playQueueStore={playerStore.playQueueStore} />

			{!playerStore.playQueueStore.isEmpty && (
				<MiniPlayer
					playerStore={playerStore}
					playQueueStore={playerStore.playQueueStore}
				/>
			)}

			<BottomBar
				playerStore={playerStore}
				playQueueStore={playerStore.playQueueStore}
			/>
		</>
	);
});
