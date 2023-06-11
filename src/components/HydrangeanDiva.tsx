import { BottomBar } from '@/components/BottomBar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerStore } from '@/stores/PlayerStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
} from '@fluentui/react-icons';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface HydrangeanDivaProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

export const HydrangeanDiva = observer(
	({
		playerStore,
		playQueueStore,
	}: HydrangeanDivaProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		React.useEffect(() => {
			return reaction(
				() => playQueueStore.currentItem,
				async (currentItem, previousItem) => {
					if (
						currentItem === undefined ||
						previousItem === undefined
					) {
						return;
					}

					if (currentItem.id === previousItem.id) {
						await diva.setCurrentTime(0);
					}
				},
			);
		}, [playQueueStore, diva]);

		return (
			<>
				<EuiFlexGroup alignItems="center" gutterSize="m">
					<EuiFlexItem grow={false}>
						<EuiButton
							disabled={playQueueStore.isEmpty}
							onClick={(): Promise<void> =>
								playQueueStore.playSelectedItemsNext()
							}
						>
							Play next{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={AddRegular}
							onClick={(): Promise<void> =>
								playQueueStore.addSelectedItems()
							}
							disabled={playQueueStore.isEmpty}
						>
							Add to play queue{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DismissRegular}
							onClick={(): Promise<void> =>
								playQueueStore.removeSelectedItems()
							}
							disabled={playQueueStore.isEmpty}
						>
							Remove{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DeleteRegular}
							onClick={(): void => playQueueStore.clear()}
							disabled={playQueueStore.isEmpty}
						>
							Clear{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
				</EuiFlexGroup>

				{!playQueueStore.isEmpty && (
					<>
						<EuiSpacer size="l" />
						<PlayQueueTable playQueueStore={playQueueStore} />
					</>
				)}

				{!playQueueStore.isEmpty && (
					<MiniPlayer
						playerStore={playerStore}
						playQueueStore={playQueueStore}
					/>
				)}

				<BottomBar
					playerStore={playerStore}
					playQueueStore={playQueueStore}
				/>
			</>
		);
	},
);
