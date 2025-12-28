import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
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
	bottomBarStore: IBottomBarStore;
}

const MuteButton = observer(
	({ bottomBarStore }: MuteButtonProps): ReactElement => {
		return (
			<EuiButtonIcon
				title="Mute" /* LOC */
				aria-label="Mute" /* LOC */
				iconType={Speaker2Regular}
				size="s"
				iconSize="l"
				disabled={!bottomBarStore.controller.supports('setMuted')}
			/>
		);
	},
);

interface VolumePopoverProps {
	bottomBarStore: IBottomBarStore;
	button?: NonNullable<ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const VolumePopover = observer(
	({
		bottomBarStore,
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
						<MuteButton bottomBarStore={bottomBarStore} />
						<EuiRange
							min={0}
							max={100}
							step={1}
							value={value}
							onChange={handleChange}
							css={{ blockSize: 32 }}
							disabled={
								!bottomBarStore.controller.supports('setVolume')
							}
						/>
					</EuiFlexGroup>
				</EuiFormRow>
			</EuiPopover>
		);
	},
);

interface VolumeButtonProps {
	bottomBarStore: IBottomBarStore;
}

const VolumeButton = observer(
	({ bottomBarStore }: VolumeButtonProps): ReactElement => {
		const [isVolumePopoverOpen, setIsVolumePopoverOpen] = useState(false);

		const toggleVolumePopover = (): void =>
			setIsVolumePopoverOpen(!isVolumePopoverOpen);

		return (
			<VolumePopover
				bottomBarStore={bottomBarStore}
				button={
					<EuiButtonIcon
						title="Volume" /* LOC */
						aria-label="Volume" /* LOC */
						iconType={Speaker2Regular}
						size="s"
						iconSize="l"
						onClick={toggleVolumePopover}
						disabled={
							!bottomBarStore.controller.supports('getVolume')
						}
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
	bottomBarStore: IBottomBarStore;
	closePopover: () => void;
}

const MoreOptionsContextMenu = observer(
	({
		bottomBarStore,
		closePopover,
	}: MoreOptionsContextMenuProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handleClickSkipBack10 = useCallback(async () => {
			await bottomBarStore.skipBack10();

			closePopover();
		}, [bottomBarStore, closePopover]);

		const handleClickSkipForward30 = useCallback(async () => {
			await bottomBarStore.skipForward30();

			closePopover();
		}, [bottomBarStore, closePopover]);

		const handleClickPlaybackRate = useCallback(
			async (playbackRate: number): Promise<void> => {
				await diva.setPlaybackRate(playbackRate);

				closePopover();
			},
			[diva, closePopover],
		);

		const handleClickRemoveFromPlayQueue =
			useCallback(async (): Promise<void> => {
				if (bottomBarStore.currentItem !== undefined) {
					await bottomBarStore.playQueueStore.removeItems([
						bottomBarStore.currentItem,
					]);
				}

				closePopover();
			}, [bottomBarStore, closePopover]);

		const [playbackRate, setPlaybackRate] = useState<number>();

		const handleClickSpeed = useCallback(async (): Promise<void> => {
			await bottomBarStore.controller
				.getPlaybackRate()
				.then((playbackRate) => setPlaybackRate(playbackRate));
		}, [bottomBarStore]);

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
								!bottomBarStore.controller.supports(
									'getPlaybackRate',
								),
						},
						{
							name: 'Skip back 10 seconds' /* LOC */,
							icon: <EuiIcon type={SkipBack10Regular} />,
							onClick: handleClickSkipBack10,
							disabled: !bottomBarStore.canSkipBack10,
						},
						{
							name: 'Skip forward 30 seconds' /* LOC */,
							icon: <EuiIcon type={SkipForward30Regular} />,
							onClick: handleClickSkipForward30,
							disabled: !bottomBarStore.canSkipForward30,
						},
						{
							isSeparator: true,
						},
						{
							name: 'Remove from play queue' /* LOC */,
							icon: <EuiIcon type={DismissRegular} />,
							onClick: handleClickRemoveFromPlayQueue,
							disabled: bottomBarStore.playQueueStore.isEmpty,
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
								!bottomBarStore.controller.supports(
									'setPlaybackRate',
								),
						}),
					),
				},
			],
			[
				bottomBarStore,
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
	bottomBarStore: IBottomBarStore;
	button?: NonNullable<ReactNode>;
	isOpen: boolean;
	closePopover: () => void;
}

const MoreOptionsPopover = memo(
	({
		bottomBarStore,
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
					bottomBarStore={bottomBarStore}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

interface MoreOptionsButtonProps {
	bottomBarStore: IBottomBarStore;
}

const MoreOptionsButton = memo(
	({ bottomBarStore }: MoreOptionsButtonProps): ReactElement => {
		const [isMoreOptionsPopoverOpen, setIsMoreOptionsPopoverOpen] =
			useState(false);

		const toggleMoreOptionsPopover = (): void =>
			setIsMoreOptionsPopoverOpen(!isMoreOptionsPopoverOpen);

		return (
			<MoreOptionsPopover
				bottomBarStore={bottomBarStore}
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
	bottomBarStore: IBottomBarStore;
	onClickPlayQueueButton?: MouseEventHandler<HTMLButtonElement>;
}

export const BottomBarRightControls = memo(
	({
		bottomBarStore,
		onClickPlayQueueButton,
	}: BottomBarRightControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="flexEnd"
				alignItems="center"
			>
				<VolumeButton bottomBarStore={bottomBarStore} />
				{onClickPlayQueueButton && (
					<PlayQueueButton
						onClickPlayQueueButton={onClickPlayQueueButton}
					/>
				)}
				<MoreOptionsButton bottomBarStore={bottomBarStore} />
			</EuiFlexGroup>
		);
	},
);
