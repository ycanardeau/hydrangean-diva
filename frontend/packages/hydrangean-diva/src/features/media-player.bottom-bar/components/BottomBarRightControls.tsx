import { useBottomBar } from '@/features/media-player.bottom-bar.abstractions/contexts/BottomBarContext';
import { repeatIconTypes } from '@/features/media-player.bottom-bar/components/BottomBarCenterControls';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButtonIcon,
	EuiContextMenu,
	type EuiContextMenuItemIcon,
	type EuiContextMenuPanelDescriptor,
	type EuiContextMenuPanelItemDescriptor,
	EuiFlexGroup,
	EuiFormRow,
	EuiIcon,
	EuiPopover,
	EuiRange,
} from '@elastic/eui';
import type { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
import {
	ArrowShuffleFilled,
	ArrowShuffleOffFilled,
	DismissRegular,
	MoreHorizontalFilled,
	NavigationPlayRegular,
	SkipBack10Regular,
	SkipForward30Regular,
	Speaker2Regular,
	TopSpeedRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import {
	type MouseEventHandler,
	type ReactElement,
	type ReactNode,
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react';

const MuteButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	return (
		<EuiButtonIcon
			title="Mute" /* LOC */
			aria-label="Mute" /* LOC */
			iconType={Speaker2Regular}
			size="s"
			iconSize="l"
			disabled={!bottomBar.controller.supports('setMuted')}
		/>
	);
});

interface VolumePopoverProps {
	button?: NonNullable<ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const VolumePopover = observer(
	({ button, isOpen, closePopover }: VolumePopoverProps): ReactElement => {
		const bottomBar = useBottomBar();

		const [value, setValue] = useState('0');

		const diva = useNostalgicDiva();

		useLayoutEffect(() => {
			if (isOpen) {
				void diva.getVolume().then((volume) => {
					if (volume !== undefined) {
						setValue(Math.floor(volume * 100).toString());
					}
				});
			}
		}, [isOpen, diva]);

		const handleChange = useCallback(
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
						<MuteButton />
						<EuiRange
							min={0}
							max={100}
							step={1}
							value={value}
							onChange={handleChange}
							css={{ blockSize: 32 }}
							disabled={
								!bottomBar.controller.supports('setVolume')
							}
						/>
					</EuiFlexGroup>
				</EuiFormRow>
			</EuiPopover>
		);
	},
);

const VolumeButton = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	const [isVolumePopoverOpen, setIsVolumePopoverOpen] = useState(false);

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
					disabled={!bottomBar.controller.supports('getVolume')}
				/>
			}
			isOpen={isVolumePopoverOpen}
			closePopover={(): void => setIsVolumePopoverOpen(false)}
		/>
	);
});

interface PlayQueueButtonProps {
	onClickPlayQueueButton: MouseEventHandler<HTMLButtonElement>;
}

const PlayQueueButton = ({
	onClickPlayQueueButton,
}: PlayQueueButtonProps): ReactElement => {
	return (
		<EuiButtonIcon
			title="Play queue" /* LOC */
			aria-label="Play queue" /* LOC */
			iconType={NavigationPlayRegular}
			size="s"
			iconSize="l"
			onClick={onClickPlayQueueButton}
		/>
	);
};

interface MoreOptionsContextMenuProps {
	closePopover: () => void;
}

const MoreOptionsContextMenu = observer(
	({ closePopover }: MoreOptionsContextMenuProps): ReactElement => {
		const bottomBar = useBottomBar();

		const diva = useNostalgicDiva();

		const [playbackRate, setPlaybackRate] = useState<number>();

		const handleClickSpeed = useCallback(async (): Promise<void> => {
			await bottomBar.controller
				.getPlaybackRate()
				.then((playbackRate) => setPlaybackRate(playbackRate));
		}, [bottomBar]);

		const createItem = useCallback(
			({
				name,
				icon,
				onClick,
				disabled,
				className,
			}: {
				name: string;
				icon: EuiContextMenuItemIcon;
				onClick: () => void;
				disabled: boolean;
				className?: string;
			}): EuiContextMenuPanelItemDescriptor => {
				return {
					name: name,
					icon: icon,
					onClick: async (): Promise<void> => {
						closePopover();

						onClick();
					},
					disabled: disabled,
					className: className,
				};
			},
			[closePopover],
		);

		const panels = useMemo(
			(): EuiContextMenuPanelDescriptor[] => [
				{
					id: 0,
					items: [
						{
							name: 'Speed' /* LOC */,
							icon: <EuiIcon type={TopSpeedRegular} />,
							panel: 1,
							onClick: handleClickSpeed,
							disabled:
								!bottomBar.controller.supports(
									'getPlaybackRate',
								),
						},
						createItem({
							name: 'Skip back 10 seconds' /* LOC */,
							icon: <EuiIcon type={SkipBack10Regular} />,
							onClick: bottomBar.skipBack10,
							disabled: !bottomBar.canSkipBack10,
						}),
						createItem({
							name: 'Skip forward 30 seconds' /* LOC */,
							icon: <EuiIcon type={SkipForward30Regular} />,
							onClick: bottomBar.skipForward30,
							disabled: !bottomBar.canSkipForward30,
						}),
						createItem({
							name: `Shuffle: ${bottomBar.shuffle ? 'On' : 'Off'}` /* LOC */,
							icon: (
								<EuiIcon
									type={
										bottomBar.shuffle
											? ArrowShuffleFilled
											: ArrowShuffleOffFilled
									}
								/>
							),
							onClick: bottomBar.toggleShuffle,
							disabled: !bottomBar.canToggleShuffle,
							className: 'eui-showFor--xs--flex',
						}),
						createItem({
							name: `Repeat: ${
								bottomBar.repeat === RepeatMode.All
									? 'All'
									: bottomBar.repeat === RepeatMode.One
										? 'One'
										: 'Off'
							}` /* LOC */,
							icon: (
								<EuiIcon
									type={repeatIconTypes[bottomBar.repeat]}
								/>
							),
							onClick: bottomBar.toggleRepeat,
							disabled: !bottomBar.canToggleRepeat,
							className: 'eui-showFor--xs--flex',
						}),
						{
							isSeparator: true,
						},
						createItem({
							name: 'Remove from play queue' /* LOC */,
							icon: <EuiIcon type={DismissRegular} />,
							onClick: bottomBar.removeFromPlayQueue,
							disabled: !bottomBar.canRemoveFromPlayQueue,
						}),
					],
				},
				{
					id: 1,
					title: 'Speed' /* LOC */,
					items: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
						(value) =>
							createItem({
								name: value.toString(),
								onClick: (): Promise<void> =>
									diva.setPlaybackRate(value),
								icon:
									value === playbackRate ? 'check' : 'empty',
								disabled:
									!bottomBar.controller.supports(
										'setPlaybackRate',
									),
							}),
					),
				},
			],
			[bottomBar, createItem, handleClickSpeed, diva, playbackRate],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface MoreOptionsPopoverProps {
	button?: NonNullable<ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const MoreOptionsPopover = memo(
	({
		button,
		isOpen,
		closePopover,
	}: MoreOptionsPopoverProps): ReactElement => {
		return (
			<EuiPopover
				button={button}
				isOpen={isOpen}
				closePopover={closePopover}
				panelPaddingSize="none"
				anchorPosition="upRight"
			>
				<MoreOptionsContextMenu closePopover={closePopover} />
			</EuiPopover>
		);
	},
);

const MoreOptionsButton = memo((): ReactElement => {
	const [isMoreOptionsPopoverOpen, setIsMoreOptionsPopoverOpen] =
		useState(false);

	const toggleMoreOptionsPopover = (): void =>
		setIsMoreOptionsPopoverOpen(!isMoreOptionsPopoverOpen);

	return (
		<MoreOptionsPopover
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
});

interface BottomBarRightControlsProps {
	onClickPlayQueueButton?: MouseEventHandler<HTMLButtonElement>;
}

export const BottomBarRightControls = memo(
	({ onClickPlayQueueButton }: BottomBarRightControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="flexEnd"
				alignItems="center"
			>
				<VolumeButton />
				{onClickPlayQueueButton && (
					<PlayQueueButton
						onClickPlayQueueButton={onClickPlayQueueButton}
					/>
				)}
				<MoreOptionsButton />
			</EuiFlexGroup>
		);
	},
);
