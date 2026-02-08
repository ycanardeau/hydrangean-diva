import { videoServiceIcons } from '@/features/common/helpers/videoServiceIcons';
import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import { useBottomBar } from '@/features/media-player.player/contexts/BottomBarContext';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButtonEmpty,
	EuiContextMenu,
	type EuiContextMenuItemIcon,
	type EuiContextMenuPanelDescriptor,
	type EuiContextMenuPanelItemDescriptor,
	EuiFlexGroup,
	EuiIcon,
	EuiPopover,
} from '@elastic/eui';
import { OpenRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, memo, useCallback, useMemo, useState } from 'react';

interface PlayQueueItemContextMenuProps {
	item: IPlayQueueItemStore;
	closePopover: () => void;
}

const PlayQueueItemContextMenu = memo(
	({ item, closePopover }: PlayQueueItemContextMenuProps): ReactElement => {
		const diva = useNostalgicDiva();

		const createItem = useCallback(
			({
				name,
				icon,
				onClick,
			}: {
				name: string;
				icon: EuiContextMenuItemIcon;
				onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
			}): EuiContextMenuPanelItemDescriptor => ({
				name: name,
				icon: icon,
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
							name: 'Open in new tab' /* LOC */,
							icon: <EuiIcon type={OpenRegular} />,
							onClick: async (): Promise<void> => {
								await diva.pause();

								window.open(item.dto.url, '_blank');
							},
						}),
						createItem({
							name: 'Copy link address' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								await navigator.clipboard.writeText(
									item.dto.url,
								);
							},
						}),
						createItem({
							name: 'Copy link text' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								await navigator.clipboard.writeText(
									item.dto.title,
								);
							},
						}),
					],
				},
			],
			[createItem, diva, item],
		);

		return <EuiContextMenu initialPanelId={0} panels={panels} />;
	},
);

interface PlayQueueItemPopoverProps {
	item: IPlayQueueItemStore;
}

const PlayQueueItemPopover = memo(
	({ item }: PlayQueueItemPopoverProps): ReactElement => {
		const [isOpen, setIsOpen] = useState(false);

		const togglePopover = useCallback(() => setIsOpen(!isOpen), [isOpen]);
		const closePopover = useCallback(() => setIsOpen(false), []);

		return (
			<EuiPopover
				button={
					<EuiButtonEmpty
						iconType={videoServiceIcons[item.type]}
						size="s"
						onClick={togglePopover}
					>
						{item.title}
					</EuiButtonEmpty>
				}
				isOpen={isOpen}
				closePopover={closePopover}
				panelPaddingSize="none"
				anchorPosition="upLeft"
			>
				<PlayQueueItemContextMenu
					item={item}
					closePopover={closePopover}
				/>
			</EuiPopover>
		);
	},
);

export const BottomBarLeftControls = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	return (
		<EuiFlexGroup
			responsive={false}
			gutterSize="s"
			justifyContent="flexStart"
			alignItems="center"
		>
			{bottomBar.currentItem && (
				<PlayQueueItemPopover item={bottomBar.currentItem} />
			)}
		</EuiFlexGroup>
	);
});
