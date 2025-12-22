import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButtonIcon,
	EuiContextMenu,
	EuiContextMenuPanelDescriptor,
	EuiFlexGroup,
	EuiFormRow,
	EuiIcon,
	EuiPopover,
	EuiRange,
} from '@elastic/eui';
import { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
import {
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
	MouseEventHandler,
	ReactElement,
	ReactNode,
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react';

interface MuteButtonProps {
	playerStore: IPlayerStore;
}

const MuteButton = observer(
	({ playerStore }: MuteButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Mute" /* LOC */
				aria-label="Mute" /* LOC */
				iconType={Speaker2Regular}
				size="s"
				iconSize="l"
				disabled={!playerStore.controller.supports('setMuted')}
			/>
		);
	},
);

interface VolumePopoverProps {
	playerStore: IPlayerStore;
	button?: NonNullable<ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const VolumePopover = observer(
	({
		playerStore,
		button,
		isOpen,
		closePopover,
	}: VolumePopoverProps): ReactElement => {
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
						<MuteButton playerStore={playerStore} />
						<EuiRange
							min={0}
							max={100}
							step={1}
							value={value}
							onChange={handleChange}
							css={{ blockSize: 32 }}
							disabled={
								!playerStore.controller.supports('setVolume')
							}
						/>
					</EuiFlexGroup>
				</EuiFormRow>
			</EuiPopover>
		);
	},
);

interface VolumeButtonProps {
	playerStore: IPlayerStore;
}

const VolumeButton = observer(
	({ playerStore }: VolumeButtonProps): ReactElement => {
		const [isVolumePopoverOpen, setIsVolumePopoverOpen] = useState(false);

		const toggleVolumePopover = (): void =>
			setIsVolumePopoverOpen(!isVolumePopoverOpen);

		return (
			<VolumePopover
				playerStore={playerStore}
				button={
					<EuiButtonIcon
						title="Volume" /* LOC */
						aria-label="Volume" /* LOC */
						iconType={Speaker2Regular}
						size="s"
						iconSize="l"
						onClick={toggleVolumePopover}
						disabled={!playerStore.controller.supports('getVolume')}
					/>
				}
				isOpen={isVolumePopoverOpen}
				closePopover={(): void => setIsVolumePopoverOpen(false)}
			/>
		);
	},
);

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
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
	closePopover: () => void;
}

const MoreOptionsContextMenu = observer(
	({
		playerStore,
		playQueueStore,
		closePopover,
	}: MoreOptionsContextMenuProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handleClickSkipBack10 = useCallback(async () => {
			const currentTime = await diva.getCurrentTime();

			if (currentTime !== undefined) {
				await diva.setCurrentTime(currentTime - 10);
			}

			closePopover();
		}, [diva, closePopover]);

		const handleClickSkipForward30 = useCallback(async () => {
			const currentTime = await diva.getCurrentTime();

			if (currentTime !== undefined) {
				await diva.setCurrentTime(currentTime + 30);
			}

			closePopover();
		}, [diva, closePopover]);

		const handleClickPlaybackRate = useCallback(
			async (playbackRate: number): Promise<void> => {
				await diva.setPlaybackRate(playbackRate);

				closePopover();
			},
			[diva, closePopover],
		);

		const handleClickRemoveFromPlayQueue =
			useCallback(async (): Promise<void> => {
				if (playQueueStore.currentItem !== undefined) {
					await playQueueStore.removeItems([
						playQueueStore.currentItem,
					]);
				}

				closePopover();
			}, [playQueueStore, closePopover]);

		const [playbackRate, setPlaybackRate] = useState<number>();

		const handleClickSpeed = useCallback(async (): Promise<void> => {
			await playerStore.controller
				.getPlaybackRate()
				.then((playbackRate) => setPlaybackRate(playbackRate));
		}, [playerStore]);

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
								!playerStore.controller.supports(
									'getPlaybackRate',
								),
						},
						{
							name: 'Skip back 10 seconds' /* LOC */,
							icon: <EuiIcon type={SkipBack10Regular} />,
							onClick: handleClickSkipBack10,
							disabled:
								playQueueStore.isEmpty ||
								!playerStore.controller.supports(
									'setCurrentTime',
								),
						},
						{
							name: 'Skip forward 30 seconds' /* LOC */,
							icon: <EuiIcon type={SkipForward30Regular} />,
							onClick: handleClickSkipForward30,
							disabled:
								playQueueStore.isEmpty ||
								!playerStore.controller.supports(
									'setCurrentTime',
								),
						},
						{
							isSeparator: true,
						},
						{
							name: 'Remove from play queue' /* LOC */,
							icon: <EuiIcon type={DismissRegular} />,
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
							disabled:
								!playerStore.controller.supports(
									'setPlaybackRate',
								),
						}),
					),
				},
			],
			[
				playerStore,
				playQueueStore,
				handleClickSpeed,
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
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
	button?: NonNullable<ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const MoreOptionsPopover = memo(
	({
		playerStore,
		playQueueStore,
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
				<MoreOptionsContextMenu
					playerStore={playerStore}
					playQueueStore={playQueueStore}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

interface MoreOptionsButtonProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

const MoreOptionsButton = memo(
	({ playerStore, playQueueStore }: MoreOptionsButtonProps): ReactElement => {
		const [isMoreOptionsPopoverOpen, setIsMoreOptionsPopoverOpen] =
			useState(false);

		const toggleMoreOptionsPopover = (): void =>
			setIsMoreOptionsPopoverOpen(!isMoreOptionsPopoverOpen);

		return (
			<MoreOptionsPopover
				playerStore={playerStore}
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
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
	onClickPlayQueueButton?: MouseEventHandler<HTMLButtonElement>;
}

export const BottomBarRightControls = memo(
	({
		playerStore,
		playQueueStore,
		onClickPlayQueueButton,
	}: BottomBarRightControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="flexEnd"
				alignItems="center"
			>
				<VolumeButton playerStore={playerStore} />
				{onClickPlayQueueButton && (
					<PlayQueueButton
						onClickPlayQueueButton={onClickPlayQueueButton}
					/>
				)}
				<MoreOptionsButton
					playerStore={playerStore}
					playQueueStore={playQueueStore}
				/>
			</EuiFlexGroup>
		);
	},
);
