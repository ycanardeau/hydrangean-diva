import { BottomBarCenterControls } from '@/features/media-player.player/components/bottom-bar/BottomBarCenterControls';
import { BottomBarLeftControls } from '@/features/media-player.player/components/bottom-bar/BottomBarLeftControls';
import { BottomBarRightControls } from '@/features/media-player.player/components/bottom-bar/BottomBarRightControls';
import { SeekBar } from '@/features/media-player.player/components/bottom-bar/SeekBar';
import { useBottomBarStore } from '@/features/media-player.player/contexts/BottomBarStoreContext';
import { EuiBottomBar, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React, { MouseEventHandler, ReactElement } from 'react';

interface BottomBarProps {
	onClickPlayQueueButton?: MouseEventHandler<HTMLButtonElement>;
}

export const BottomBar = observer(
	({ onClickPlayQueueButton }: BottomBarProps): ReactElement => {
		const bottomBarStore = useBottomBarStore();

		return (
			<EuiBottomBar paddingSize="s">
				<EuiFlexGroup direction="column" gutterSize="none">
					<EuiFlexItem>
						<SeekBar bottomBarStore={bottomBarStore} />
					</EuiFlexItem>
					<EuiFlexItem>
						<EuiFlexGroup responsive={false}>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarLeftControls
									bottomBarStore={bottomBarStore}
								/>
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarCenterControls
									bottomBarStore={bottomBarStore}
								/>
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarRightControls
									bottomBarStore={bottomBarStore}
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
