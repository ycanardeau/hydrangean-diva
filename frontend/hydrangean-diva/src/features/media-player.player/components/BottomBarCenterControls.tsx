import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiButtonIcon, EuiFlexGroup, IconType } from '@elastic/eui';
import {
	ArrowRepeat1Filled,
	ArrowRepeatAllFilled,
	ArrowRepeatAllOffFilled,
	ArrowShuffleFilled,
	ArrowShuffleOffFilled,
	NextFilled,
	PauseFilled,
	PlayFilled,
	PreviousFilled,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { ReactElement, useCallback } from 'react';

import { IPlayQueueStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueStore';
import { RepeatMode } from '@/features/media-player.play-queue/interfaces/RepeatMode';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';

const repeatIconTypes: Record<RepeatMode, IconType> = {
	[RepeatMode.Off]: ArrowRepeatAllOffFilled,
	[RepeatMode.All]: ArrowRepeatAllFilled,
	[RepeatMode.One]: ArrowRepeat1Filled,
};

interface BottomBarCenterControlsProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

export const BottomBarCenterControls = observer(
	({
		playerStore,
		playQueueStore,
	}: BottomBarCenterControlsProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handlePrevious = useCallback(async () => {
			if (playQueueStore.hasPreviousItem) {
				const currentTime = await diva.getCurrentTime();
				if (currentTime === undefined || currentTime < 5) {
					await playQueueStore.previous();
				} else {
					await diva.setCurrentTime(0);
				}
			} else {
				await diva.setCurrentTime(0);
			}
		}, [playQueueStore, diva]);

		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="center"
				alignItems="center"
			>
				<EuiButtonIcon
					title={
						`Shuffle: ${
							playQueueStore.shuffle ? 'On' : 'Off'
						}` /* LOC */
					}
					aria-label={
						`Shuffle: ${
							playQueueStore.shuffle ? 'On' : 'Off'
						}` /* LOC */
					}
					iconType={
						playQueueStore.shuffle
							? ArrowShuffleFilled
							: ArrowShuffleOffFilled
					}
					size="s"
					iconSize="l"
					onClick={playQueueStore.toggleShuffle}
					disabled /* TODO: remove */
				/>
				<EuiButtonIcon
					title="Previous" /* LOC */
					aria-label="Previous" /* LOC */
					iconType={PreviousFilled}
					size="s"
					iconSize="l"
					onClick={handlePrevious}
					disabled={playQueueStore.isEmpty}
				/>
				{playerStore.playing ? (
					<EuiButtonIcon
						title="Pause" /* LOC */
						aria-label="Pause" /* LOC */
						iconType={PauseFilled}
						size="s"
						iconSize="l"
						onClick={(): Promise<void> => diva.pause()}
						disabled={
							!playQueueStore.canPause ||
							!playerStore.controller.supports('pause')
						}
					/>
				) : (
					<EuiButtonIcon
						title="Play" /* LOC */
						aria-label="Play" /* LOC */
						iconType={PlayFilled}
						size="s"
						iconSize="l"
						onClick={(): Promise<void> => diva.play()}
						disabled={
							!playQueueStore.canPlay ||
							!playerStore.controller.supports('play')
						}
					/>
				)}
				<EuiButtonIcon
					title="Next" /* LOC */
					aria-label="Next" /* LOC */
					iconType={NextFilled}
					size="s"
					iconSize="l"
					onClick={playQueueStore.next}
					disabled={!playQueueStore.hasNextItem}
				/>
				<EuiButtonIcon
					title={
						`Repeat: ${
							playQueueStore.repeat === RepeatMode.All
								? 'All'
								: playQueueStore.repeat === RepeatMode.One
									? 'One'
									: 'Off'
						}` /* LOC */
					}
					aria-label={
						`Repeat: ${
							playQueueStore.repeat === RepeatMode.All
								? 'All'
								: playQueueStore.repeat === RepeatMode.One
									? 'One'
									: 'Off'
						}` /* LOC */
					}
					iconType={repeatIconTypes[playQueueStore.repeat]}
					size="s"
					iconSize="l"
					onClick={playQueueStore.toggleRepeat}
				/>
			</EuiFlexGroup>
		);
	},
);
