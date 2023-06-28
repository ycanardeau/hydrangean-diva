import { PlayQueueStore, RepeatMode } from '@/stores/PlayQueueStore';
import { PlayerStore } from '@/stores/PlayerStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiBottomBar,
	EuiButtonIcon,
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormRow,
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
	NextFilled,
	PauseFilled,
	PlayFilled,
	PreviousFilled,
	Speaker2Regular,
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
						diva.setCurrentTime(duration * percent);
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

const VolumePopover = ({
	button,
	isOpen,
	closePopover,
}: VolumePopoverProps): React.ReactElement => {
	const [value, setValue] = React.useState('0');

	const diva = useNostalgicDiva();

	React.useLayoutEffect(() => {
		diva.getVolume().then((volume) => {
			if (volume !== undefined) {
				setValue(Math.floor(volume * 100).toString());
			}
		});
	}, [isOpen, diva]);

	const handleChange = React.useCallback(
		async (e): Promise<void> => {
			setValue(e.currentTarget.value);

			await diva.setVolume(Number(e.currentTarget.value) / 100);
		},
		[diva],
	);

	return (
		<EuiPopover button={button} isOpen={isOpen} closePopover={closePopover}>
			<EuiFormRow>
				<EuiFlexGroup
					responsive={false}
					gutterSize="s"
					justifyContent="center"
					alignItems="center"
				>
					<EuiButtonIcon
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
};

const repeatIconTypes: Record<RepeatMode, IconType> = {
	[RepeatMode.Off]: ArrowRepeatAllOffFilled,
	[RepeatMode.All]: ArrowRepeatAllFilled,
	[RepeatMode.One]: ArrowRepeat1Filled,
};

interface BottomBarProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

export const BottomBar = observer(
	({ playerStore, playQueueStore }: BottomBarProps): React.ReactElement => {
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

		const [isVolumePopoverOpen, setIsVolumePopoverOpen] =
			React.useState(false);

		const toggleVolumePopover = (): void =>
			setIsVolumePopoverOpen(!isVolumePopoverOpen);

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
								<EuiFlexGroup
									responsive={false}
									gutterSize="s"
									justifyContent="center"
									alignItems="center"
								>
									<EuiButtonIcon
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
										iconType={PreviousFilled}
										size="s"
										iconSize="l"
										onClick={handlePrevious}
										disabled={playQueueStore.isEmpty}
									/>
									{playerStore.playing ? (
										<EuiButtonIcon
											iconType={PauseFilled}
											size="s"
											iconSize="l"
											onClick={(): Promise<void> =>
												diva.pause()
											}
											disabled={!playerStore.canPlay}
										/>
									) : (
										<EuiButtonIcon
											iconType={PlayFilled}
											size="s"
											iconSize="l"
											onClick={(): Promise<void> =>
												diva.play()
											}
											disabled={!playerStore.canPlay}
										/>
									)}
									<EuiButtonIcon
										iconType={NextFilled}
										size="s"
										iconSize="l"
										onClick={playQueueStore.next}
										disabled={!playQueueStore.hasNextItem}
									/>
									<EuiButtonIcon
										iconType={
											repeatIconTypes[
												playQueueStore.repeat
											]
										}
										size="s"
										iconSize="l"
										onClick={playQueueStore.toggleRepeat}
									/>
								</EuiFlexGroup>
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<EuiFlexGroup
									responsive={false}
									gutterSize="s"
									justifyContent="flexEnd"
									alignItems="center"
								>
									<VolumePopover
										button={
											<EuiButtonIcon
												iconType={Speaker2Regular}
												size="s"
												iconSize="l"
												onClick={toggleVolumePopover}
											/>
										}
										isOpen={isVolumePopoverOpen}
										closePopover={(): void =>
											setIsVolumePopoverOpen(false)
										}
									/>
								</EuiFlexGroup>
							</EuiFlexItem>
						</EuiFlexGroup>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiBottomBar>
		);
	},
);
