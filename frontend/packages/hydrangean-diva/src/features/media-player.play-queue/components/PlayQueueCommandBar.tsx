import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import {
	EuiButton,
	EuiButtonIcon,
	EuiContextMenu,
	type EuiContextMenuItemIcon,
	type EuiContextMenuPanelDescriptor,
	type EuiContextMenuPanelItemDescriptor,
	EuiFlexGroup,
	EuiFlexItem,
	EuiHideFor,
	EuiIcon,
	EuiPopover,
	EuiShowFor,
	useEuiTheme,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
	MoreHorizontalFilled,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, memo, useCallback, useMemo, useState } from 'react';

interface AddToPlayQueueButtonProps {
	playQueue: IPlayQueueStore;
}

const AddToPlayQueueButton = observer(
	({ playQueue }: AddToPlayQueueButtonProps): ReactElement => {
		return (
			<EuiButton
				iconType={AddRegular}
				onClick={playQueue.addSelectedItems}
				disabled={!playQueue.canAddSelectedItems}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);

interface MoreContextMenuProps {
	playQueue: IPlayQueueStore;
	closePopover: () => void;
}

const MoreContextMenu = observer(
	({ playQueue, closePopover }: MoreContextMenuProps): ReactElement => {
		const createItem = useCallback(
			({
				name,
				icon,
				disabled,
				onClick,
			}: {
				name: string;
				icon: EuiContextMenuItemIcon;
				disabled?: boolean;
				onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
			}): EuiContextMenuPanelItemDescriptor => ({
				name: name,
				icon: icon,
				disabled: disabled,
				onClick: async (e): Promise<void> => {
					closePopover();

					onClick(e);
				},
			}),
			[closePopover],
		);

		const panels = useMemo(
			(): EuiContextMenuPanelDescriptor[] => [
				{
					id: 0,
					items: [
						createItem({
							name: 'Play next' /* LOC */,
							icon: <EuiIcon type="" />,
							disabled: !playQueue.canPlaySelectedItemsNext,
							onClick: playQueue.playSelectedItemsNext,
						}),
						createItem({
							name: 'Add to play queue' /* LOC */,
							icon: <EuiIcon type={AddRegular} />,
							onClick: playQueue.addSelectedItems,
							disabled: !playQueue.canAddSelectedItems,
						}),
						createItem({
							name: 'Remove' /* LOC */,
							icon: <EuiIcon type={DismissRegular} />,
							onClick: playQueue.removeSelectedItems,
							disabled: !playQueue.canRemoveSelectedItems,
						}),
						createItem({
							name: 'Clear' /* LOC */,
							icon: <EuiIcon type={DeleteRegular} />,
							onClick: playQueue.clear,
							disabled: !playQueue.canClear,
						}),
					],
				},
			],
			[createItem, playQueue],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface MorePopoverProps {
	playQueue: IPlayQueueStore;
}

const MorePopover = memo(({ playQueue }: MorePopoverProps): ReactElement => {
	const [isOpen, setIsOpen] = useState(false);

	const togglePopover = useCallback(() => setIsOpen(!isOpen), [isOpen]);
	const closePopover = useCallback(() => setIsOpen(false), []);

	return (
		<EuiPopover
			button={
				<EuiButtonIcon
					display="base"
					size="m"
					iconType={MoreHorizontalFilled}
					onClick={togglePopover}
				/>
			}
			isOpen={isOpen}
			closePopover={closePopover}
			panelPaddingSize="none"
			anchorPosition="downLeft"
		>
			<MoreContextMenu
				playQueue={playQueue}
				closePopover={closePopover}
			/>
		</EuiPopover>
	);
});

interface PlayQueueCommandBarProps {
	playQueue: IPlayQueueStore;
}

export const PlayQueueCommandBar = observer(
	({ playQueue }: PlayQueueCommandBarProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		return (
			<EuiFlexGroup
				alignItems="center"
				gutterSize="m"
				responsive={false}
				style={{
					position: 'sticky',
					top: 48,
					zIndex: 998,
					background: euiTheme.colors.backgroundBasePlain,
				}}
			>
				<EuiHideFor sizes={['xs']}>
					<EuiFlexItem grow={false}>
						<EuiButton
							disabled={!playQueue.canPlaySelectedItemsNext}
							onClick={playQueue.playSelectedItemsNext}
						>
							Play next{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<AddToPlayQueueButton playQueue={playQueue} />
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DismissRegular}
							onClick={playQueue.removeSelectedItems}
							disabled={!playQueue.canRemoveSelectedItems}
						>
							Remove{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DeleteRegular}
							onClick={playQueue.clear}
							disabled={!playQueue.canClear}
						>
							Clear{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
				</EuiHideFor>
				<EuiShowFor sizes={['xs']}>
					<MorePopover playQueue={playQueue} />
				</EuiShowFor>
				<EuiFlexItem grow={true} />
				<EuiFlexItem grow={false}>
					<AddVideoButton onFulfilled={playQueue.addItemFromDto} />
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
