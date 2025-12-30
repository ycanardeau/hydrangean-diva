import { featureFlags } from '@/features/common/helpers/featureFlags';
import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddToSelectablePopover } from '@/features/media-player.play-queue/components/AddToSelectablePopover';
import {
	AddVideoButton,
	AddVideoFormSubmitEvent,
} from '@/features/media-player.play-queue/components/AddVideoButton';
import { DeveloperToolsButton } from '@/features/media-player.play-queue/components/DeveloperToolsButton';
import { PlayQueueTable } from '@/features/media-player.play-queue/components/PlayQueueTable';
import { isNoembedResult } from '@/features/media-player.play-queue/helpers/isNoembedResult';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { findVideoService } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiEmptyPrompt,
	EuiFlexGroup,
	EuiFlexItem,
	EuiSpacer,
	useEuiTheme,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useCallback } from 'react';

interface AddToPlayQueueButtonProps {
	playQueue: IPlayQueueStore;
}

const AddToPlayQueueButton = observer(
	({ playQueue }: AddToPlayQueueButtonProps): ReactElement => {
		return (
			<EuiButton
				iconType={AddRegular}
				onClick={playQueue.addSelectedItems}
				disabled={!playQueue.canAddSelectedItems}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);

interface PlayQueueProps {
	playQueue: IPlayQueueStore;
}

export const PlayQueue = observer(
	({ playQueue }: PlayQueueProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		const handleAddToPlaylist =
			useCallback(async (): Promise<void> => {}, []);

		const handleAddVideo = useCallback(
			async (e: AddVideoFormSubmitEvent): Promise<void> => {
				const videoService = findVideoService(e.url);
				if (videoService === undefined) {
					return;
				}

				const videoId = videoService.extractVideoId(e.url);
				if (videoId === undefined) {
					return;
				}

				const response = await fetch(
					`https://noembed.com/embed?url=${encodeURIComponent(
						e.url,
					)}`,
				);
				const jsonData = await response.json();

				const item = playQueue.createItem({
					url: e.url,
					type: videoService.type,
					videoId: videoId,
					title:
						e.title ||
						(isNoembedResult(jsonData) ? jsonData.title : videoId),
				});

				await playQueue.addItems([item]);
			},
			[playQueue],
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
							disabled={!playQueue.canPlaySelectedItemsNext}
							onClick={playQueue.playSelectedItemsNext}
						>
							Play next{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<AddToPlayQueueButton playQueue={playQueue} />
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
							onClick={playQueue.removeSelectedItems}
							disabled={!playQueue.canRemoveSelectedItems}
						>
							Remove{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DeleteRegular}
							onClick={playQueue.clear}
							disabled={!playQueue.canClear}
						>
							Clear{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={true} />
					<EuiFlexItem grow={false}>
						{false && (
							<DeveloperToolsButton
								playQueue={playQueue as PlayQueueStore}
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

				{playQueue.isEmpty ? (
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
					<PlayQueueTable playQueue={playQueue} />
				)}
			</>
		);
	},
);
