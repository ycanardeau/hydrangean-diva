import { featureFlags } from '@/features/common/helpers/featureFlags';
import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddToSelectablePopover } from '@/features/media-player.play-queue/components/AddToSelectablePopover';
import {
	AddVideoButton,
	AddVideoFormSubmitEvent,
} from '@/features/media-player.play-queue/components/AddVideoButton';
import { PlayQueueTable } from '@/features/media-player.play-queue/components/PlayQueueTable';
import { isNoembedResult } from '@/features/media-player.play-queue/helpers/isNoembedResult';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { findVideoService } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiCodeBlock,
	EuiEmptyPrompt,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFlyout,
	EuiSpacer,
	useEuiTheme,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
	WindowDevToolsRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useCallback, useState } from 'react';

interface AddToPlayQueueButtonProps {
	playQueueStore: IPlayQueueStore;
}

const AddToPlayQueueButton = observer(
	({ playQueueStore }: AddToPlayQueueButtonProps): ReactElement => {
		return (
			<EuiButton
				iconType={AddRegular}
				onClick={playQueueStore.addSelectedItems}
				disabled={
					playQueueStore.isEmpty || !playQueueStore.hasSelectedItems
				}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);

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

				<EuiButton
					onClick={(): void =>
						setIsFlyoutVisible((visible) => !visible)
					}
					iconType={WindowDevToolsRegular}
				>
					Developer tools
				</EuiButton>
			</>
		);
	},
);

interface PlayQueueProps {
	playQueueStore: IPlayQueueStore;
}

export const PlayQueue = observer(
	({ playQueueStore }: PlayQueueProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		const handleAddToPlaylist =
			useCallback(async (): Promise<void> => {}, []);

		const handleAddVideo = useCallback(
			async (e: AddVideoFormSubmitEvent): Promise<void> => {
				const videoService = findVideoService(e.url);
				if (videoService !== undefined) {
					const videoId = videoService.extractVideoId(e.url);
					if (videoId !== undefined) {
						const response = await fetch(
							`https://noembed.com/embed?url=${encodeURIComponent(
								e.url,
							)}`,
						);
						const jsonData = await response.json();

						await playQueueStore.addItems([
							playQueueStore.createItem({
								url: e.url,
								type: videoService.type,
								videoId: videoId,
								title:
									e.title ||
									(isNoembedResult(jsonData)
										? jsonData.title
										: videoId),
							}),
						]);
					}
				}
			},
			[playQueueStore],
		);

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
								!playQueueStore.hasSelectedItems
							}
							onClick={playQueueStore.playSelectedItemsNext}
						>
							Play next{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<AddToPlayQueueButton playQueueStore={playQueueStore} />
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<AddToSelectablePopover
							disabled={!featureFlags.mediaPlayer.enablePlaylists}
							onAddToPlaylist={handleAddToPlaylist}
						/>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DismissRegular}
							onClick={playQueueStore.removeSelectedItems}
							disabled={
								playQueueStore.isEmpty ||
								!playQueueStore.hasSelectedItems
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
						{false && (
							<DeveloperToolsButton
								playQueueStore={
									playQueueStore as PlayQueueStore
								}
							/>
						)}

						<AddVideoButton onSave={handleAddVideo} />
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
						actions={<AddVideoButton onSave={handleAddVideo} />}
					/>
				) : (
					<PlayQueueTable playQueueStore={playQueueStore} />
				)}
			</>
		);
	},
);
