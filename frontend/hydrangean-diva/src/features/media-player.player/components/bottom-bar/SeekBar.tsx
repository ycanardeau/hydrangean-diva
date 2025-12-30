import { useBottomBar } from '@/features/media-player.player/contexts/BottomBarContext';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiRange } from '@elastic/eui';
import { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
import { observer } from 'mobx-react-lite';
import { ReactElement, useCallback } from 'react';

export const SeekBar = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	const diva = useNostalgicDiva();

	const handleChange = useCallback(
		(e: _SingleRangeChangeEvent) => {
			const percent = Number(e.currentTarget.value) / 100;

			bottomBar.setPercent(percent);
		},
		[bottomBar],
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			if (e.button === 0) {
				bottomBar.setSeeking(true);
			}
		},
		[bottomBar],
	);

	const handleMouseUp = useCallback(
		async (e: React.MouseEvent<HTMLInputElement>) => {
			if (e.button === 0) {
				const percent = Number(e.currentTarget.value) / 100;

				bottomBar.setSeeking(false);

				const duration = await diva.getDuration();
				if (duration !== undefined) {
					await diva.setCurrentTime(duration * percent);
				}
			}
		},
		[bottomBar, diva],
	);

	return (
		<EuiRange
			min={0}
			max={100}
			step={0.0000001}
			value={bottomBar.percent * 100}
			onChange={handleChange}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			fullWidth
			showRange
			css={{ blockSize: 32 }}
			disabled={!bottomBar.canSeek}
		/>
	);
});
