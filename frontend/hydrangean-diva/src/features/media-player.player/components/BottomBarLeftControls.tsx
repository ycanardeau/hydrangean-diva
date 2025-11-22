import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiButtonEmpty, EuiFlexGroup } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

import { videoServiceIcons } from '@/features/common/constants/videoServiceIcons';
import { IPlayQueueStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueStore';

interface BottomBarLeftControlsProps {
	playQueueStore: IPlayQueueStore;
}

export const BottomBarLeftControls = observer(
	({ playQueueStore }: BottomBarLeftControlsProps): ReactElement => {
		const diva = useNostalgicDiva();

		return (
			<EuiFlexGroup
				responsive={false}
				gutterSize="s"
				justifyContent="flexStart"
				alignItems="center"
			>
				{playQueueStore.currentItem && (
					<EuiButtonEmpty
						href={playQueueStore.currentItem.url}
						target="_blank"
						iconType={
							videoServiceIcons[playQueueStore.currentItem.type]
						}
						size="s"
						onClick={(): Promise<void> => diva.pause()}
					>
						{playQueueStore.currentItem.title}
					</EuiButtonEmpty>
				)}
			</EuiFlexGroup>
		);
	},
);
