import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
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
import { ReactElement } from 'react';

interface ShuffleButtonProps {
	bottomBarStore: IBottomBarStore;
}

const ShuffleButton = observer(
	({ bottomBarStore }: ShuffleButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title={
					`Shuffle: ${bottomBarStore.shuffle ? 'On' : 'Off'}` /* LOC */
				}
				aria-label={
					`Shuffle: ${bottomBarStore.shuffle ? 'On' : 'Off'}` /* LOC */
				}
				iconType={
					bottomBarStore.shuffle
						? ArrowShuffleFilled
						: ArrowShuffleOffFilled
				}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.toggleShuffle}
				disabled={!bottomBarStore.canToggleShuffle}
			/>
		);
	},
);

interface PreviousButtonProps {
	bottomBarStore: IBottomBarStore;
}

const PreviousButton = observer(
	({ bottomBarStore }: PreviousButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Previous" /* LOC */
				aria-label="Previous" /* LOC */
				iconType={PreviousFilled}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.previous}
				disabled={!bottomBarStore.canPrevious}
			/>
		);
	},
);

interface SkipBack10ButtonProps {
	bottomBarStore: IBottomBarStore;
}

const SkipBack10Button = observer(
	({ bottomBarStore }: SkipBack10ButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Skip back 10 seconds" /* LOC */
				aria-label="Skip back 10 seconds" /* LOC */
				iconType={SkipBack10Regular}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.skipBack10}
				disabled={!bottomBarStore.canSkipBack10}
			/>
		);
	},
);

interface PauseButtonProps {
	bottomBarStore: IBottomBarStore;
}

const PauseButton = observer(
	({ bottomBarStore }: PauseButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Pause" /* LOC */
				aria-label="Pause" /* LOC */
				iconType={PauseFilled}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.pause}
				disabled={!bottomBarStore.canPause}
			/>
		);
	},
);

interface PlayButtonProps {
	bottomBarStore: IBottomBarStore;
}

const PlayButton = observer(
	({ bottomBarStore }: PlayButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Play" /* LOC */
				aria-label="Play" /* LOC */
				iconType={PlayFilled}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.play}
				disabled={!bottomBarStore.canPlay}
			/>
		);
	},
);

interface SkipForward30ButtonProps {
	bottomBarStore: IBottomBarStore;
}

const SkipForward30Button = observer(
	({ bottomBarStore }: SkipForward30ButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Skip forward 30 seconds" /* LOC */
				aria-label="Skip forward 30 seconds" /* LOC */
				iconType={SkipForward30Regular}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.skipForward30}
				disabled={!bottomBarStore.canSkipForward30}
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
				onClick={bottomBarStore.next}
				disabled={!bottomBarStore.canNext}
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
						bottomBarStore.repeat === RepeatMode.All
							? 'All'
							: bottomBarStore.repeat === RepeatMode.One
								? 'One'
								: 'Off'
					}` /* LOC */
				}
				aria-label={
					`Repeat: ${
						bottomBarStore.repeat === RepeatMode.All
							? 'All'
							: bottomBarStore.repeat === RepeatMode.One
								? 'One'
								: 'Off'
					}` /* LOC */
				}
				iconType={repeatIconTypes[bottomBarStore.repeat]}
				size="s"
				iconSize="l"
				onClick={bottomBarStore.toggleRepeat}
				disabled={!bottomBarStore.canToggleRepeat}
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
				{bottomBarStore.playing ? (
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
