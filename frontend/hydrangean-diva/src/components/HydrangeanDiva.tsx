import { BottomBar, bottomBarHeight } from '@/components/BottomBar';
import { MiniPlayer, miniPlayerSize } from '@/components/MiniPlayer';
import { PlayQueueTable } from '@/components/PlayQueueTable';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerStore } from '@/stores/PlayerStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { useLocalStorageStateStore } from '@aigamo/route-sphere';
import {
	EuiButton,
	EuiCodeBlock,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFlyout,
	EuiPageTemplate,
	EuiSpacer,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
	WindowDevToolsRegular,
} from '@fluentui/react-icons';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { Header } from './Header';
import { AddVideoButton } from '@/components/AddVideoButton';

interface DeveloperToolsButtonProps {
	playQueueStore: PlayQueueStore;
}

const DeveloperToolsButton = observer(
	({ playQueueStore }: DeveloperToolsButtonProps): React.ReactElement => {
		const [isFlyoutVisible, setIsFlyoutVisible] = React.useState(false);

		return (
			<>
				{isFlyoutVisible && (
					<EuiFlyout
						type="push"
						size="s"
						onClose={(): void => setIsFlyoutVisible(false)}
					>
						<div style={{ blockSize: '100%' }}>
							<EuiCodeBlock
								language="json"
								overflowHeight="100%"
								isCopyable
								isVirtualized
							>
								{JSON.stringify(
									playQueueStore.localStorageState,
									undefined,
									2,
								)}
							</EuiCodeBlock>
						</div>
					</EuiFlyout>
				)}

				<AddVideoButton playQueueStore={playQueueStore} />
			</>
		);
	},
);

interface PlayQueueProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

const PlayQueue = observer(
	({ playerStore, playQueueStore }: PlayQueueProps): React.ReactElement => {
		return (
			<>
				<EuiFlexGroup
					alignItems="center"
					gutterSize="m"
					style={{
						position: 'sticky',
						top: 48,
						zIndex: 998,
						background: '#1D1E24',
					}}
				>
					<EuiFlexItem grow={false}>
						<EuiButton
							disabled={
								playQueueStore.isEmpty ||
								playQueueStore.selectedItems.length === 0
							}
							onClick={playQueueStore.playSelectedItemsNext}
						>
							Play next{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={AddRegular}
							onClick={playQueueStore.addSelectedItems}
							disabled={
								playQueueStore.isEmpty ||
								playQueueStore.selectedItems.length === 0
							}
						>
							Add to play queue{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DismissRegular}
							onClick={playQueueStore.removeSelectedItems}
							disabled={
								playQueueStore.isEmpty ||
								playQueueStore.selectedItems.length === 0
							}
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
					<EuiFlexItem grow={true} />
					<EuiFlexItem grow={false}>
						<DeveloperToolsButton playQueueStore={playQueueStore} />
					</EuiFlexItem>
				</EuiFlexGroup>

				{!playQueueStore.isEmpty && (
					<>
						<EuiSpacer
							size="l"
							style={{
								position: 'sticky',
								top: 48 + 40,
								zIndex: 998,
								background: '#1D1E24',
							}}
						/>

						<PlayQueueTable playQueueStore={playQueueStore} />

						<EuiSpacer
							style={{ blockSize: miniPlayerSize.height }}
						/>

						<MiniPlayer
							playerStore={playerStore}
							playQueueStore={playQueueStore}
						/>
					</>
				)}
			</>
		);
	},
);

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

		useLocalStorageStateStore('PlayQueueStore', playQueueStore);

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

					if (
						currentItem.type === previousItem.type &&
						currentItem.videoId === previousItem.videoId
					) {
						await diva.setCurrentTime(0);
					}
				},
			);
		}, [playQueueStore, diva]);

		return (
			<>
				<Header playQueueStore={playQueueStore} />

				<EuiPageTemplate
					panelled
					style={{
						minBlockSize: `max(460px, 100vh - ${bottomBarHeight}px)`,
					}}
				>
					<EuiPageTemplate.Header
						pageTitle="Play queue" /* LOC */
						rightSideItems={[]}
					/>

					<EuiPageTemplate.Section>
						<PlayQueue
							playerStore={playerStore}
							playQueueStore={playQueueStore}
						/>
					</EuiPageTemplate.Section>
				</EuiPageTemplate>

				<BottomBar
					playerStore={playerStore}
					playQueueStore={playQueueStore}
				/>
			</>
		);
	},
);
