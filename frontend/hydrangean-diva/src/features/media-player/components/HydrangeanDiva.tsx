import {
	EuiButton,
	EuiCodeBlock,
	EuiEmptyPrompt,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFlyout,
	EuiPageTemplate,
	EuiSpacer,
	useEuiTheme,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useState } from 'react';

import { AddVideoButton } from '@/features/media-player/components/AddVideoButton';
import { PlayQueueTable } from '@/features/media-player/components/PlayQueueTable';
import { PlayerStore } from '@/features/media-player/stores/PlayerStore';
import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';

interface DeveloperToolsButtonProps {
	playQueueStore: PlayQueueStore;
}

const DeveloperToolsButton = observer(
	({ playQueueStore }: DeveloperToolsButtonProps): ReactElement => {
		const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);

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
	({ playerStore, playQueueStore }: PlayQueueProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		return (
			<>
				<EuiFlexGroup
					alignItems="center"
					gutterSize="m"
					style={{
						position: 'sticky',
						top: 48,
						zIndex: 998,
						background: euiTheme.colors.backgroundBasePlain,
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

				<EuiSpacer
					size="l"
					style={{
						position: 'sticky',
						top: 48 + 40,
						zIndex: 998,
						background: euiTheme.colors.backgroundBasePlain,
					}}
				/>

				{playQueueStore.isEmpty ? (
					<EuiEmptyPrompt
						title={<h2>We couldn't find any videos</h2>}
						body={
							<p>
								Your video library doesn't contain any video
								content.
							</p>
						}
						actions={
							<AddVideoButton playQueueStore={playQueueStore} />
						}
					/>
				) : (
					<PlayQueueTable playQueueStore={playQueueStore} />
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
	({ playerStore, playQueueStore }: HydrangeanDivaProps): ReactElement => {
		return (
			<>
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
			</>
		);
	},
);
