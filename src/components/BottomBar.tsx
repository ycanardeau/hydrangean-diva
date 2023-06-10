import { usePlayerStore } from '@/components/PlayerStoreContext';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import {
	EuiBottomBar,
	EuiButtonIcon,
	EuiFlexGroup,
	EuiFlexItem,
	EuiRange,
} from '@elastic/eui';
import { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
import {
	ArrowRepeatAllFilled,
	ArrowShuffleFilled,
	NextFilled,
	PlayFilled,
	PreviousFilled,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

const SeekBar = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();
	const diva = useNostalgicDiva();

	const handleChange = React.useCallback(
		(e: _SingleRangeChangeEvent) => {
			const percent = Number(e.currentTarget.value) / 100;
			playerStore.setPercent(percent);
		},
		[playerStore],
	);

	const handleMouseDown = React.useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			if (e.button === 0) {
				playerStore.setSeeking(true);
			}
		},
		[playerStore],
	);

	const handleMouseUp = React.useCallback(
		async (e: React.MouseEvent<HTMLInputElement>) => {
			if (e.button === 0) {
				const percent = Number(e.currentTarget.value) / 100;

				playerStore.setSeeking(false);

				const duration = await diva.getDuration();
				if (duration !== undefined) {
					diva.setCurrentTime(duration * percent);
				}
			}
		},
		[playerStore, diva],
	);

	return (
		<EuiRange
			min={0}
			max={100}
			step={0.0000001}
			value={playerStore.percent * 100}
			onChange={handleChange}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			fullWidth
			showRange
		/>
	);
});

export const BottomBar = (): React.ReactElement => {
	return (
		<EuiBottomBar>
			<EuiFlexGroup direction="column" gutterSize="none">
				<EuiFlexItem>
					<SeekBar />
				</EuiFlexItem>
				<EuiFlexItem>
					<EuiFlexGroup
						responsive={false}
						gutterSize="s"
						justifyContent="center"
						alignItems="center"
					>
						<EuiButtonIcon
							iconType={ArrowShuffleFilled}
							size="m"
							iconSize="l"
						/>
						<EuiButtonIcon
							iconType={PreviousFilled}
							size="m"
							iconSize="l"
						/>
						<EuiButtonIcon
							iconType={PlayFilled}
							size="m"
							iconSize="l"
						/>
						<EuiButtonIcon
							iconType={NextFilled}
							size="m"
							iconSize="l"
						/>
						<EuiButtonIcon
							iconType={ArrowRepeatAllFilled}
							size="m"
							iconSize="l"
						/>
					</EuiFlexGroup>
				</EuiFlexItem>
			</EuiFlexGroup>
		</EuiBottomBar>
	);
};
