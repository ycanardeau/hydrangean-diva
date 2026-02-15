import { useBottomBar } from '@/features/media-player.bottom-bar.abstractions/contexts/BottomBarContext';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { EuiButtonIcon, EuiFlexGroup, type IconType } from '@elastic/eui';
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
import type { ReactElement } from 'react';

const ShuffleButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	return (
		<EuiButtonIcon
			title={`Shuffle: ${bottomBar.shuffle ? 'On' : 'Off'}` /* LOC */}
			aria-label={
				`Shuffle: ${bottomBar.shuffle ? 'On' : 'Off'}` /* LOC */
			}
			iconType={
				bottomBar.shuffle ? ArrowShuffleFilled : ArrowShuffleOffFilled
			}
			size="s"
			iconSize="l"
			onClick={bottomBar.toggleShuffle}
			disabled={!bottomBar.canToggleShuffle}
		/>
	);
});

const PreviousButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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
});

const SkipBack10Button = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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
});

const PauseButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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
});

const PlayButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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

const SkipForward30Button = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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
});

const NextButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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

const RepeatButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

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
});

export const BottomBarCenterControls = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	return (
		<EuiFlexGroup
			responsive={false}
			gutterSize="s"
			justifyContent="center"
			alignItems="center"
		>
			<ShuffleButton />
			<PreviousButton />
			<SkipBack10Button />
			{bottomBar.playing ? <PauseButton /> : <PlayButton />}
			<SkipForward30Button />
			<NextButton />
			<RepeatButton />
		</EuiFlexGroup>
	);
});
