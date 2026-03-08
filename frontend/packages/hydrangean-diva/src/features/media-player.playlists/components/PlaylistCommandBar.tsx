import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import type { IPlaylistStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistStore';
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
	DismissRegular,
	MoreHorizontalFilled,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, memo, useCallback, useMemo, useState } from 'react';

interface AddToPlaylistButtonProps {
	playlist: IPlaylistStore;
}

const AddToPlaylistButton = observer(
	({ playlist }: AddToPlaylistButtonProps): ReactElement => {
		return (
			<EuiButton
				iconType={AddRegular}
				onClick={playlist.addSelectedItems}
				disabled={!playlist.canAddSelectedItems}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);

interface MoreContextMenuProps {
	playlist: IPlaylistStore;
	closePopover: () => void;
}

const MoreContextMenu = observer(
	({ playlist, closePopover }: MoreContextMenuProps): ReactElement => {
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
							disabled: !playlist.canPlaySelectedItemsNext,
							onClick: playlist.playSelectedItemsNext,
						}),
						createItem({
							name: 'Add to play queue' /* LOC */,
							icon: <EuiIcon type={AddRegular} />,
							onClick: playlist.addSelectedItems,
							disabled: !playlist.canAddSelectedItems,
						}),
						createItem({
							name: 'Remove' /* LOC */,
							icon: <EuiIcon type={DismissRegular} />,
							onClick: playlist.removeSelectedItems,
							disabled: !playlist.canRemoveSelectedItems,
						}),
					],
				},
			],
			[createItem, playlist],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface MorePopoverProps {
	playlist: IPlaylistStore;
}

const MorePopover = memo(({ playlist }: MorePopoverProps): ReactElement => {
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
			<MoreContextMenu playlist={playlist} closePopover={closePopover} />
		</EuiPopover>
	);
});

interface PlaylistCommandBarProps {
	playlist: IPlaylistStore;
}

export const PlaylistCommandBar = observer(
	({ playlist }: PlaylistCommandBarProps): ReactElement => {
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
							disabled={!playlist.canPlaySelectedItemsNext}
							onClick={playlist.playSelectedItemsNext}
						>
							Play next{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<AddToPlaylistButton playlist={playlist} />
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType={DismissRegular}
							onClick={playlist.removeSelectedItems}
							disabled={!playlist.canRemoveSelectedItems}
						>
							Remove{/* LOC */}
						</EuiButton>
					</EuiFlexItem>
				</EuiHideFor>
				<EuiShowFor sizes={['xs']}>
					<MorePopover playlist={playlist} />
				</EuiShowFor>
				<EuiFlexItem grow={true} />
				<EuiFlexItem grow={false}>
					<AddVideoButton onFulfilled={playlist.addItemFromDto} />
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
