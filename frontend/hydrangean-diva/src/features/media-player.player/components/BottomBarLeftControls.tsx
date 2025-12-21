import { videoServiceIcons } from '@/features/common/helpers/videoServiceIcons';
import { IPlayQueueItemStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueItemStore';
import { IPlayQueueStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiButtonEmpty,
	EuiContextMenu,
	EuiContextMenuPanelDescriptor,
	EuiFlexGroup,
	EuiIcon,
	EuiPopover,
} from '@elastic/eui';
import { OpenRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { ReactElement, memo, useCallback, useMemo, useState } from 'react';

interface PlayQueueItemContextMenuProps {
	item: IPlayQueueItemStore;
	closePopover: () => void;
}

const PlayQueueItemContextMenu = memo(
	({ item, closePopover }: PlayQueueItemContextMenuProps): ReactElement => {
		const diva = useNostalgicDiva();

		const panels = useMemo(
			(): EuiContextMenuPanelDescriptor[] => [
				{
					id: 0,
					items: [
						{
							name: 'Open in new tab' /* LOC */,
							icon: <EuiIcon type={OpenRegular} />,
							onClick: async (): Promise<void> => {
								closePopover();

								await diva.pause();

								window.open(item.dto.url, '_blank');
							},
						},
						{
							name: 'Copy link address' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								closePopover();

								await navigator.clipboard.writeText(
									item.dto.url,
								);
							},
						},
						{
							name: 'Copy link text' /* LOC */,
							icon: <EuiIcon type="" />,
							onClick: async (): Promise<void> => {
								closePopover();

								await navigator.clipboard.writeText(
									item.dto.title,
								);
							},
						},
					],
				},
			],
			[closePopover, diva, item],
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

interface BottomBarLeftControlsProps {
	playQueueStore: IPlayQueueStore;
}

export const BottomBarLeftControls = observer(
	({ playQueueStore }: BottomBarLeftControlsProps): ReactElement => {
		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="flexStart"
				alignItems="center"
			>
				{playQueueStore.currentItem && (
					<PlayQueueItemPopover item={playQueueStore.currentItem} />
				)}
			</EuiFlexGroup>
		);
	},
);
