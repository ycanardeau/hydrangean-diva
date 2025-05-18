import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';
import { PlayerStore } from '@/features/media-player/stores/PlayerStore';
import { RepeatMode } from '@/features/media-player/stores/RepeatMode';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiBottomBar,
	EuiButtonIcon,
	EuiContextMenu,
	EuiContextMenuPanelDescriptor,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormRow,
	EuiIcon,
	EuiPopover,
	EuiRange,
	IconType,
} from '@elastic/eui';
import { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
import {
	ArrowRepeat1Filled,
	ArrowRepeatAllFilled,
	ArrowRepeatAllOffFilled,
	ArrowShuffleFilled,
	ArrowShuffleOffFilled,
	DismissRegular,
	MoreHorizontalFilled,
	NextFilled,
	PauseFilled,
	PlayFilled,
	PreviousFilled,
	SkipBack10Regular,
	SkipForward30Regular,
	Speaker2Regular,
	TopSpeedRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const bottomBarHeight = 80;

interface SeekBarProps {
	playerStore: PlayerStore;
}

const SeekBar = observer(
	({ playerStore }: SeekBarProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		const handleChange = React.useCallback(
			(e: _SingleRangeChangeEvent) => {
				const percent = Number(e.currentTarget.value) / 100;
				playerStore.setPercent(percent);
			},
			[playerStore],
		);

		const handleMouseDown = React.useCallback(
			(e: React.MouseEvent<HTMLInputElement>) => {
				if (e.button === 0) {
					playerStore.setSeeking(true);
				}
			},
			[playerStore],
		);

		const handleMouseUp = React.useCallback(
			async (e: React.MouseEvent<HTMLInputElement>) => {
				if (e.button === 0) {
					const percent = Number(e.currentTarget.value) / 100;

					playerStore.setSeeking(false);

					const duration = await diva.getDuration();
					if (duration !== undefined) {
						await diva.setCurrentTime(duration * percent);
					}
				}
			},
			[playerStore, diva],
		);

		return (
			<EuiRange
				min={0}
				max={100}
				step={0.0000001}
				value={playerStore.percent * 100}
				onChange={handleChange}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				fullWidth
				showRange
				css={{ blockSize: 32 }}
			/>
		);
	},
);

interface VolumePopoverProps {
	button?: NonNullable<React.ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const VolumePopover = React.memo(
	({
		button,
		isOpen,
		closePopover,
	}: VolumePopoverProps): React.ReactElement => {
		const [value, setValue] = React.useState('0');

		const diva = useNostalgicDiva();

		React.useLayoutEffect(() => {
			if (isOpen) {
				void diva.getVolume().then((volume) => {
					if (volume !== undefined) {
						setValue(Math.floor(volume * 100).toString());
					}
				});
			}
		}, [isOpen, diva]);

		const handleChange = React.useCallback(
			async (e: _SingleRangeChangeEvent): Promise<void> => {
				setValue(e.currentTarget.value);

				await diva.setVolume(Number(e.currentTarget.value) / 100);
			},
			[diva],
		);

		return (
			<EuiPopover
				button={button}
				isOpen={isOpen}
				closePopover={closePopover}
				anchorPosition="upRight"
			>
				<EuiFormRow>
					<EuiFlexGroup
						responsive={false}
						gutterSize="s"
						justifyContent="center"
						alignItems="center"
					>
						<EuiButtonIcon
							title="Mute" /* LOC */
							aria-label="Mute" /* LOC */
							iconType={Speaker2Regular}
							size="s"
							iconSize="l"
						/>
						<EuiRange
							min={0}
							max={100}
							step={1}
							value={value}
							onChange={handleChange}
							css={{ blockSize: 32 }}
						/>
					</EuiFlexGroup>
				</EuiFormRow>
			</EuiPopover>
		);
	},
);

interface MoreOptionsContextMenuProps {
	playQueueStore: PlayQueueStore;
	closePopover: () => void;
}

const MoreOptionsContextMenu = React.memo(
	({
		playQueueStore,
		closePopover,
	}: MoreOptionsContextMenuProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		const handleClickSkipBack10 = React.useCallback(async () => {
			const currentTime = await diva.getCurrentTime();

			if (currentTime !== undefined) {
				await diva.setCurrentTime(currentTime - 10);
			}

			closePopover();
		}, [diva, closePopover]);

		const handleClickSkipForward30 = React.useCallback(async () => {
			const currentTime = await diva.getCurrentTime();

			if (currentTime !== undefined) {
				await diva.setCurrentTime(currentTime + 30);
			}

			closePopover();
		}, [diva, closePopover]);

		const handleClickPlaybackRate = React.useCallback(
			async (playbackRate: number): Promise<void> => {
				await diva.setPlaybackRate(playbackRate);

				closePopover();
			},
			[diva, closePopover],
		);

		const handleClickRemoveFromPlayQueue =
			React.useCallback(async (): Promise<void> => {
				if (playQueueStore.currentItem !== undefined) {
					await playQueueStore.removeItems([
						playQueueStore.currentItem,
					]);
				}

				closePopover();
			}, [playQueueStore, closePopover]);

		const [playbackRate] = React.useState<number>();

		const panels = React.useMemo(
			(): EuiContextMenuPanelDescriptor[] => [
				{
					id: 0,
					items: [
						{
							name: 'Speed' /* LOC */,
							icon: <EuiIcon type={TopSpeedRegular} size="m" />,
							panel: 1,
						},
						{
							name: 'Skip back 10 seconds' /* LOC */,
							icon: <EuiIcon type={SkipBack10Regular} size="m" />,
							onClick: handleClickSkipBack10,
							disabled: playQueueStore.isEmpty,
						},
						{
							name: 'Skip forward 30 seconds' /* LOC */,
							icon: (
								<EuiIcon type={SkipForward30Regular} size="m" />
							),
							onClick: handleClickSkipForward30,
							disabled: playQueueStore.isEmpty,
						},
						{
							isSeparator: true,
						},
						{
							name: 'Remove from play queue' /* LOC */,
							icon: <EuiIcon type={DismissRegular} size="m" />,
							onClick: handleClickRemoveFromPlayQueue,
							disabled: playQueueStore.isEmpty,
						},
					],
				},
				{
					id: 1,
					title: 'Speed' /* LOC */,
					items: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
						(value) => ({
							name: value.toString(),
							onClick: (): Promise<void> =>
								handleClickPlaybackRate(value),
							icon: value === playbackRate ? 'check' : 'empty',
						}),
					),
				},
			],
			[
				playQueueStore,
				handleClickSkipBack10,
				handleClickSkipForward30,
				handleClickRemoveFromPlayQueue,
				handleClickPlaybackRate,
				playbackRate,
			],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface MoreOptionsPopoverProps {
	playQueueStore: PlayQueueStore;
	button?: NonNullable<React.ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const MoreOptionsPopover = React.memo(
	({
		playQueueStore,
		button,
		isOpen,
		closePopover,
	}: MoreOptionsPopoverProps): React.ReactElement => {
		return (
			<EuiPopover
				button={button}
				isOpen={isOpen}
				closePopover={closePopover}
				panelPaddingSize="none"
				anchorPosition="upRight"
			>
				<MoreOptionsContextMenu
					playQueueStore={playQueueStore}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

const repeatIconTypes: Record<RepeatMode, IconType> = {
	[RepeatMode.Off]: ArrowRepeatAllOffFilled,
	[RepeatMode.All]: ArrowRepeatAllFilled,
	[RepeatMode.One]: ArrowRepeat1Filled,
};

interface BottomBarCenterControlsProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

const BottomBarCenterControls = observer(
	({
		playerStore,
		playQueueStore,
	}: BottomBarCenterControlsProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		const handlePrevious = React.useCallback(async () => {
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
						disabled={!playQueueStore.canPlay}
					/>
				) : (
					<EuiButtonIcon
						title="Play" /* LOC */
						aria-label="Play" /* LOC */
						iconType={PlayFilled}
						size="s"
						iconSize="l"
						onClick={(): Promise<void> => diva.play()}
						disabled={!playQueueStore.canPlay}
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

const VolumeButton = React.memo((): React.ReactElement => {
	const [isVolumePopoverOpen, setIsVolumePopoverOpen] = React.useState(false);

	const toggleVolumePopover = (): void =>
		setIsVolumePopoverOpen(!isVolumePopoverOpen);

	return (
		<VolumePopover
			button={
				<EuiButtonIcon
					title="Volume" /* LOC */
					aria-label="Volume" /* LOC */
					iconType={Speaker2Regular}
					size="s"
					iconSize="l"
					onClick={toggleVolumePopover}
				/>
			}
			isOpen={isVolumePopoverOpen}
			closePopover={(): void => setIsVolumePopoverOpen(false)}
		/>
	);
});

interface MoreOptionsButtonProps {
	playQueueStore: PlayQueueStore;
}

const MoreOptionsButton = React.memo(
	({ playQueueStore }: MoreOptionsButtonProps): React.ReactElement => {
		const [isMoreOptionsPopoverOpen, setIsMoreOptionsPopoverOpen] =
			React.useState(false);

		const toggleMoreOptionsPopover = (): void =>
			setIsMoreOptionsPopoverOpen(!isMoreOptionsPopoverOpen);

		return (
			<MoreOptionsPopover
				playQueueStore={playQueueStore}
				button={
					<EuiButtonIcon
						title="More options" /* LOC */
						aria-label="More options" /* LOC */
						iconType={MoreHorizontalFilled}
						size="s"
						iconSize="l"
						onClick={toggleMoreOptionsPopover}
					/>
				}
				isOpen={isMoreOptionsPopoverOpen}
				closePopover={(): void => setIsMoreOptionsPopoverOpen(false)}
			/>
		);
	},
);

interface BottomBarRightControlsProps {
	playQueueStore: PlayQueueStore;
}

const BottomBarRightControls = React.memo(
	({ playQueueStore }: BottomBarRightControlsProps): React.ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="flexEnd"
				alignItems="center"
			>
				<VolumeButton />
				<MoreOptionsButton playQueueStore={playQueueStore} />
			</EuiFlexGroup>
		);
	},
);

interface BottomBarProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

export const BottomBar = observer(
	({ playerStore, playQueueStore }: BottomBarProps): React.ReactElement => {
		return (
			<EuiBottomBar paddingSize="s">
				<EuiFlexGroup direction="column" gutterSize="none">
					<EuiFlexItem>
						<SeekBar playerStore={playerStore} />
					</EuiFlexItem>
					<EuiFlexItem>
						<EuiFlexGroup responsive={false}>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }} />
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarCenterControls
									playerStore={playerStore}
									playQueueStore={playQueueStore}
								/>
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarRightControls
									playQueueStore={playQueueStore}
								/>
							</EuiFlexItem>
						</EuiFlexGroup>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiBottomBar>
		);
	},
);
