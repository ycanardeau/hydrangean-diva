import { BottomBarCenterControls } from '@/features/media-player/components/BottomBarCenterControls';
import { BottomBarLeftControls } from '@/features/media-player/components/BottomBarLeftControls';
import { BottomBarRightControls } from '@/features/media-player/components/BottomBarRightControls';
import {
	FullTime,
	RemainingTime,
} from '@/features/media-player/components/BottomBarTimers';
import { SeekBar } from '@/features/media-player/components/SeekBar';
import { EuiBottomBar, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type MouseEventHandler, type ReactElement } from 'react';

interface BottomBarProps {
	onClickPlayQueueButton?: MouseEventHandler<HTMLButtonElement>;
}

export const BottomBar = observer(
	({ onClickPlayQueueButton }: BottomBarProps): ReactElement => {
		return (
			<EuiBottomBar paddingSize="s">
				<EuiFlexGroup direction="column" gutterSize="none">
					<EuiFlexItem>
						<EuiFlexGroup
							responsive={false}
							gutterSize="s"
							alignItems="center"
						>
							<EuiFlexItem grow={false}>
								<FullTime />
							</EuiFlexItem>
							<EuiFlexItem>
								<SeekBar />
							</EuiFlexItem>
							<EuiFlexItem grow={false}>
								<RemainingTime />
							</EuiFlexItem>
						</EuiFlexGroup>
					</EuiFlexItem>
					<EuiFlexItem>
						<EuiFlexGroup responsive={false}>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarLeftControls />
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarCenterControls />
							</EuiFlexItem>
							<EuiFlexItem css={{ width: 'calc(100% / 3)' }}>
								<BottomBarRightControls
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
