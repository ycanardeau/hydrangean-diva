import { AddVideoModal } from '@/components/AddVideoModal';
import { BottomBar, bottomBarHeight } from '@/components/BottomBar';
import { MiniPlayer, miniPlayerHeight } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerStore } from '@/stores/PlayerStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiFlexGroup,
	EuiFlexItem,
	EuiPageTemplate,
	EuiSpacer,
} from '@elastic/eui';
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

		const [addVideoModalOpen, setAddVideoModalOpen] = React.useState(false);

		return (
			<>
				<EuiPageTemplate
					panelled
					style={{
						minBlockSize: `max(460px, 100vh - ${bottomBarHeight}px)`,
						paddingBlockStart: '0px',
					}}
				>
					<EuiPageTemplate.Header
						pageTitle="Play queue" /* LOC */
						rightSideItems={[
							<EuiButton
								onClick={(): void => setAddVideoModalOpen(true)}
							>
								Add video{/* LOC */}
							</EuiButton>,
						]}
					/>

					<EuiPageTemplate.Section>
						<EuiFlexGroup alignItems="center" gutterSize="m">
							<EuiFlexItem grow={false}>
								<EuiButton
									disabled={playQueueStore.isEmpty}
									onClick={
										playQueueStore.playSelectedItemsNext
									}
								>
									Play next{/* LOC */}
								</EuiButton>
							</EuiFlexItem>
							<EuiFlexItem grow={false}>
								<EuiButton
									iconType={AddRegular}
									onClick={playQueueStore.addSelectedItems}
									disabled={playQueueStore.isEmpty}
								>
									Add to play queue{/* LOC */}
								</EuiButton>
							</EuiFlexItem>
							<EuiFlexItem grow={false}>
								<EuiButton
									iconType={DismissRegular}
									onClick={playQueueStore.removeSelectedItems}
									disabled={playQueueStore.isEmpty}
								>
									Remove{/* LOC */}
								</EuiButton>
							</EuiFlexItem>
							<EuiFlexItem grow={false}>
								<EuiButton
									iconType={DeleteRegular}
									onClick={playQueueStore.clear}
									disabled={playQueueStore.isEmpty}
								>
									Clear{/* LOC */}
								</EuiButton>
							</EuiFlexItem>
						</EuiFlexGroup>

						{!playQueueStore.isEmpty && (
							<>
								<EuiSpacer size="l" />
								<PlayQueueTable
									playQueueStore={playQueueStore}
								/>
								<EuiSpacer
									style={{ blockSize: miniPlayerHeight }}
								/>
							</>
						)}
					</EuiPageTemplate.Section>
				</EuiPageTemplate>

				{addVideoModalOpen && (
					<AddVideoModal
						onCancel={(): void => setAddVideoModalOpen(false)}
						onSave={(): void => setAddVideoModalOpen(false)}
					/>
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