import { EuiBottomBar, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React, { MouseEventHandler, ReactElement } from 'react';

import { IPlayQueueStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueStore';
import { BottomBarCenterControls } from '@/features/media-player.player/components/BottomBarCenterControls';
import { BottomBarLeftControls } from '@/features/media-player.player/components/BottomBarLeftControls';
import { BottomBarRightControls } from '@/features/media-player.player/components/BottomBarRightControls';
import { SeekBar } from '@/features/media-player.player/components/SeekBar';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';

interface BottomBarProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
	onClickPlayQueueButton?: MouseEventHandler<HTMLButtonElement>;
}

export const BottomBar = observer(
	({
		playerStore,
		playQueueStore,
		onClickPlayQueueButton,
	}: BottomBarProps): ReactElement => {
		return (
			<EuiBottomBar paddingSize="s">
				<EuiFlexGroup direction="column" gutterSize="none">
					<EuiFlexItem>
						<SeekBar
							playerStore={playerStore}
							playQueueStore={playQueueStore}
						/>
					</EuiFlexItem>
					<EuiFlexItem>
						<EuiFlexGroup responsive={false}>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarLeftControls
									playQueueStore={playQueueStore}
								/>
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarCenterControls
									playerStore={playerStore}
									playQueueStore={playQueueStore}
								/>
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarRightControls
									playerStore={playerStore}
									playQueueStore={playQueueStore}
									onClickPlayQueueButton={
										onClickPlayQueueButton
									}
								/>
							</EuiFlexItem>
						</EuiFlexGroup>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiBottomBar>
		);
	},
);
