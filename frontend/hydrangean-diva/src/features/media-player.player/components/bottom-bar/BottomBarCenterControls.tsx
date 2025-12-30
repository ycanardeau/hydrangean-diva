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
	bottomBar: IBottomBarStore;
}

const ShuffleButton = observer(
	({ bottomBar }: ShuffleButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title={`Shuffle: ${bottomBar.shuffle ? 'On' : 'Off'}` /* LOC */}
				aria-label={
					`Shuffle: ${bottomBar.shuffle ? 'On' : 'Off'}` /* LOC */
				}
				iconType={
					bottomBar.shuffle
						? ArrowShuffleFilled
						: ArrowShuffleOffFilled
				}
				size="s"
				iconSize="l"
				onClick={bottomBar.toggleShuffle}
				disabled={!bottomBar.canToggleShuffle}
			/>
		);
	},
);

interface PreviousButtonProps {
	bottomBar: IBottomBarStore;
}

const PreviousButton = observer(
	({ bottomBar }: PreviousButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Previous" /* LOC */
				aria-label="Previous" /* LOC */
				iconType={PreviousFilled}
				size="s"
				iconSize="l"
				onClick={bottomBar.previous}
				disabled={!bottomBar.canPrevious}
			/>
		);
	},
);

interface SkipBack10ButtonProps {
	bottomBar: IBottomBarStore;
}

const SkipBack10Button = observer(
	({ bottomBar }: SkipBack10ButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Skip back 10 seconds" /* LOC */
				aria-label="Skip back 10 seconds" /* LOC */
				iconType={SkipBack10Regular}
				size="s"
				iconSize="l"
				onClick={bottomBar.skipBack10}
				disabled={!bottomBar.canSkipBack10}
			/>
		);
	},
);

interface PauseButtonProps {
	bottomBar: IBottomBarStore;
}

const PauseButton = observer(
	({ bottomBar }: PauseButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Pause" /* LOC */
				aria-label="Pause" /* LOC */
				iconType={PauseFilled}
				size="s"
				iconSize="l"
				onClick={bottomBar.pause}
				disabled={!bottomBar.canPause}
			/>
		);
	},
);

interface PlayButtonProps {
	bottomBar: IBottomBarStore;
}

const PlayButton = observer(({ bottomBar }: PlayButtonProps): ReactElement => {
	return (
		<EuiButtonIcon
			title="Play" /* LOC */
			aria-label="Play" /* LOC */
			iconType={PlayFilled}
			size="s"
			iconSize="l"
			onClick={bottomBar.play}
			disabled={!bottomBar.canPlay}
		/>
	);
});

interface SkipForward30ButtonProps {
	bottomBar: IBottomBarStore;
}

const SkipForward30Button = observer(
	({ bottomBar }: SkipForward30ButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Skip forward 30 seconds" /* LOC */
				aria-label="Skip forward 30 seconds" /* LOC */
				iconType={SkipForward30Regular}
				size="s"
				iconSize="l"
				onClick={bottomBar.skipForward30}
				disabled={!bottomBar.canSkipForward30}
			/>
		);
	},
);

interface NextButtonProps {
	bottomBar: IBottomBarStore;
}

const NextButton = observer(({ bottomBar }: NextButtonProps): ReactElement => {
	return (
		<EuiButtonIcon
			title="Next" /* LOC */
			aria-label="Next" /* LOC */
			iconType={NextFilled}
			size="s"
			iconSize="l"
			onClick={bottomBar.next}
			disabled={!bottomBar.canNext}
		/>
	);
});

const repeatIconTypes: Record<RepeatMode, IconType> = {
	[RepeatMode.Off]: ArrowRepeatAllOffFilled,
	[RepeatMode.All]: ArrowRepeatAllFilled,
	[RepeatMode.One]: ArrowRepeat1Filled,
};

interface RepeatButtonProps {
	bottomBar: IBottomBarStore;
}

const RepeatButton = observer(
	({ bottomBar }: RepeatButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title={
					`Repeat: ${
						bottomBar.repeat === RepeatMode.All
							? 'All'
							: bottomBar.repeat === RepeatMode.One
								? 'One'
								: 'Off'
					}` /* LOC */
				}
				aria-label={
					`Repeat: ${
						bottomBar.repeat === RepeatMode.All
							? 'All'
							: bottomBar.repeat === RepeatMode.One
								? 'One'
								: 'Off'
					}` /* LOC */
				}
				iconType={repeatIconTypes[bottomBar.repeat]}
				size="s"
				iconSize="l"
				onClick={bottomBar.toggleRepeat}
				disabled={!bottomBar.canToggleRepeat}
			/>
		);
	},
);

interface BottomBarCenterControlsProps {
	bottomBar: IBottomBarStore;
}

export const BottomBarCenterControls = observer(
	({ bottomBar }: BottomBarCenterControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="center"
				alignItems="center"
			>
				<ShuffleButton bottomBar={bottomBar} />
				<PreviousButton bottomBar={bottomBar} />
				<SkipBack10Button bottomBar={bottomBar} />
				{bottomBar.playing ? (
					<PauseButton bottomBar={bottomBar} />
				) : (
					<PlayButton bottomBar={bottomBar} />
				)}
				<SkipForward30Button bottomBar={bottomBar} />
				<NextButton bottomBar={bottomBar} />
				<RepeatButton bottomBar={bottomBar} />
			</EuiFlexGroup>
		);
	},
);
