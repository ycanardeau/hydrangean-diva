import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
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
	bottomBarStore: IBottomBarStore;
}

const ShuffleButton = observer(
	({ bottomBarStore }: ShuffleButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title={
					`Shuffle: ${bottomBarStore.playQueueStore.shuffle ? 'On' : 'Off'}` /* LOC */
				}
				aria-label={
					`Shuffle: ${bottomBarStore.playQueueStore.shuffle ? 'On' : 'Off'}` /* LOC */
				}
				iconType={
					bottomBarStore.playQueueStore.shuffle
						? ArrowShuffleFilled
						: ArrowShuffleOffFilled
				}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.playQueueStore.toggleShuffle}
				disabled /* TODO: remove */
			/>
		);
	},
);

interface PreviousButtonProps {
	bottomBarStore: IBottomBarStore;
}

const PreviousButton = observer(
	({ bottomBarStore }: PreviousButtonProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handlePrevious = useCallback(async () => {
			if (bottomBarStore.playQueueStore.hasPreviousItem) {
				const currentTime = await diva.getCurrentTime();
				if (currentTime === undefined || currentTime < 5) {
					await bottomBarStore.playQueueStore.previous();
				} else {
					await diva.setCurrentTime(0);
				}
			} else {
				await diva.setCurrentTime(0);
			}
		}, [bottomBarStore, diva]);

		return (
			<EuiButtonIcon
				title="Previous" /* LOC */
				aria-label="Previous" /* LOC */
				iconType={PreviousFilled}
				size="s"
				iconSize="l"
				onClick={handlePrevious}
				disabled={bottomBarStore.playQueueStore.isEmpty}
			/>
		);
	},
);

interface SkipBack10ButtonProps {
	bottomBarStore: IBottomBarStore;
}

const SkipBack10Button = observer(
	({ bottomBarStore }: SkipBack10ButtonProps): ReactElement => {
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
					bottomBarStore.playQueueStore.isEmpty ||
					!bottomBarStore.playerStore.controller.supports(
						'setCurrentTime',
					)
				}
			/>
		);
	},
);

interface PauseButtonProps {
	bottomBarStore: IBottomBarStore;
}

const PauseButton = observer(
	({ bottomBarStore }: PauseButtonProps): ReactElement => {
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
					!bottomBarStore.playQueueStore.canPause ||
					!bottomBarStore.playerStore.controller.supports('pause')
				}
			/>
		);
	},
);

interface PlayButtonProps {
	bottomBarStore: IBottomBarStore;
}

const PlayButton = observer(
	({ bottomBarStore }: PlayButtonProps): ReactElement => {
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
					!bottomBarStore.playQueueStore.canPlay ||
					!bottomBarStore.playerStore.controller.supports('play')
				}
			/>
		);
	},
);

interface SkipForward30ButtonProps {
	bottomBarStore: IBottomBarStore;
}

const SkipForward30Button = observer(
	({ bottomBarStore }: SkipForward30ButtonProps): ReactElement => {
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
					bottomBarStore.playQueueStore.isEmpty ||
					!bottomBarStore.playerStore.controller.supports(
						'setCurrentTime',
					)
				}
			/>
		);
	},
);

interface NextButtonProps {
	bottomBarStore: IBottomBarStore;
}

const NextButton = observer(
	({ bottomBarStore }: NextButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Next" /* LOC */
				aria-label="Next" /* LOC */
				iconType={NextFilled}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.playQueueStore.next}
				disabled={!bottomBarStore.playQueueStore.hasNextItem}
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
	bottomBarStore: IBottomBarStore;
}

const RepeatButton = observer(
	({ bottomBarStore }: RepeatButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title={
					`Repeat: ${
						bottomBarStore.playQueueStore.repeat === RepeatMode.All
							? 'All'
							: bottomBarStore.playQueueStore.repeat ===
								  RepeatMode.One
								? 'One'
								: 'Off'
					}` /* LOC */
				}
				aria-label={
					`Repeat: ${
						bottomBarStore.playQueueStore.repeat === RepeatMode.All
							? 'All'
							: bottomBarStore.playQueueStore.repeat ===
								  RepeatMode.One
								? 'One'
								: 'Off'
					}` /* LOC */
				}
				iconType={repeatIconTypes[bottomBarStore.playQueueStore.repeat]}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.playQueueStore.toggleRepeat}
			/>
		);
	},
);

interface BottomBarCenterControlsProps {
	bottomBarStore: IBottomBarStore;
}

export const BottomBarCenterControls = observer(
	({ bottomBarStore }: BottomBarCenterControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="center"
				alignItems="center"
			>
				<ShuffleButton bottomBarStore={bottomBarStore} />
				<PreviousButton bottomBarStore={bottomBarStore} />
				<SkipBack10Button bottomBarStore={bottomBarStore} />
				{bottomBarStore.playerStore.playing ? (
					<PauseButton bottomBarStore={bottomBarStore} />
				) : (
					<PlayButton bottomBarStore={bottomBarStore} />
				)}
				<SkipForward30Button bottomBarStore={bottomBarStore} />
				<NextButton bottomBarStore={bottomBarStore} />
				<RepeatButton bottomBarStore={bottomBarStore} />
			</EuiFlexGroup>
		);
	},
);
