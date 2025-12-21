import { IPlayQueueStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueStore';
import { RepeatMode } from '@/features/media-player.play-queue/interfaces/RepeatMode';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
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
	SkipBack10Regular,
	SkipForward30Regular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { ReactElement, useCallback } from 'react';

interface ShuffleButtonProps {
	playQueueStore: IPlayQueueStore;
}

const ShuffleButton = observer(
	({ playQueueStore }: ShuffleButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title={
					`Shuffle: ${playQueueStore.shuffle ? 'On' : 'Off'}` /* LOC */
				}
				aria-label={
					`Shuffle: ${playQueueStore.shuffle ? 'On' : 'Off'}` /* LOC */
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
		);
	},
);

interface PreviousButtonProps {
	playQueueStore: IPlayQueueStore;
}

const PreviousButton = observer(
	({ playQueueStore }: PreviousButtonProps): ReactElement => {
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
			<EuiButtonIcon
				title="Previous" /* LOC */
				aria-label="Previous" /* LOC */
				iconType={PreviousFilled}
				size="s"
				iconSize="l"
				onClick={handlePrevious}
				disabled={playQueueStore.isEmpty}
			/>
		);
	},
);

interface SkipBack10ButtonProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

const SkipBack10Button = observer(
	({ playerStore, playQueueStore }: SkipBack10ButtonProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handleClick = useCallback(async () => {
			const currentTime = await diva.getCurrentTime();

			if (currentTime !== undefined) {
				await diva.setCurrentTime(currentTime - 10);
			}
		}, [diva]);

		return (
			<EuiButtonIcon
				title="Skip back 10 seconds" /* LOC */
				aria-label="Skip back 10 seconds" /* LOC */
				iconType={SkipBack10Regular}
				size="s"
				iconSize="l"
				onClick={handleClick}
				disabled={
					playQueueStore.isEmpty ||
					!playerStore.controller.supports('setCurrentTime')
				}
			/>
		);
	},
);

interface PauseButtonProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

const PauseButton = observer(
	({ playerStore, playQueueStore }: PauseButtonProps): ReactElement => {
		const diva = useNostalgicDiva();

		return (
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
		);
	},
);

interface PlayButtonProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

const PlayButton = observer(
	({ playerStore, playQueueStore }: PlayButtonProps): ReactElement => {
		const diva = useNostalgicDiva();

		return (
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
		);
	},
);

interface SkipForward30ButtonProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

const SkipForward30Button = observer(
	({
		playerStore,
		playQueueStore,
	}: SkipForward30ButtonProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handleClick = useCallback(async () => {
			const currentTime = await diva.getCurrentTime();

			if (currentTime !== undefined) {
				await diva.setCurrentTime(currentTime + 30);
			}
		}, [diva]);

		return (
			<EuiButtonIcon
				title="Skip forward 30 seconds" /* LOC */
				aria-label="Skip forward 30 seconds" /* LOC */
				iconType={SkipForward30Regular}
				size="s"
				iconSize="l"
				onClick={handleClick}
				disabled={
					playQueueStore.isEmpty ||
					!playerStore.controller.supports('setCurrentTime')
				}
			/>
		);
	},
);

interface NextButtonProps {
	playQueueStore: IPlayQueueStore;
}

const NextButton = observer(
	({ playQueueStore }: NextButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Next" /* LOC */
				aria-label="Next" /* LOC */
				iconType={NextFilled}
				size="s"
				iconSize="l"
				onClick={playQueueStore.next}
				disabled={!playQueueStore.hasNextItem}
			/>
		);
	},
);

const repeatIconTypes: Record<RepeatMode, IconType> = {
	[RepeatMode.Off]: ArrowRepeatAllOffFilled,
	[RepeatMode.All]: ArrowRepeatAllFilled,
	[RepeatMode.One]: ArrowRepeat1Filled,
};

interface RepeatButtonProps {
	playQueueStore: IPlayQueueStore;
}

const RepeatButton = observer(
	({ playQueueStore }: RepeatButtonProps): ReactElement => {
		return (
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
		);
	},
);

interface BottomBarCenterControlsProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

export const BottomBarCenterControls = observer(
	({
		playerStore,
		playQueueStore,
	}: BottomBarCenterControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="center"
				alignItems="center"
			>
				<ShuffleButton playQueueStore={playQueueStore} />
				<PreviousButton playQueueStore={playQueueStore} />
				<SkipBack10Button
					playerStore={playerStore}
					playQueueStore={playQueueStore}
				/>
				{playerStore.playing ? (
					<PauseButton
						playerStore={playerStore}
						playQueueStore={playQueueStore}
					/>
				) : (
					<PlayButton
						playerStore={playerStore}
						playQueueStore={playQueueStore}
					/>
				)}
				<SkipForward30Button
					playerStore={playerStore}
					playQueueStore={playQueueStore}
				/>
				<NextButton playQueueStore={playQueueStore} />
				<RepeatButton playQueueStore={playQueueStore} />
			</EuiFlexGroup>
		);
	},
);
