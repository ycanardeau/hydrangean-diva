import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiRange } from '@elastic/eui';
import { _SingleRangeChangeEvent } from '@elastic/eui/src/components/form/range/types';
import { observer } from 'mobx-react-lite';
import { ReactElement, useCallback } from 'react';

interface SeekBarProps {
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}

export const SeekBar = observer(
	({ playerStore, playQueueStore }: SeekBarProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handleChange = useCallback(
			(e: _SingleRangeChangeEvent) => {
				const percent = Number(e.currentTarget.value) / 100;
				playerStore.setPercent(percent);
			},
			[playerStore],
		);

		const handleMouseDown = useCallback(
			(e: React.MouseEvent<HTMLInputElement>) => {
				if (e.button === 0) {
					playerStore.setSeeking(true);
				}
			},
			[playerStore],
		);

		const handleMouseUp = useCallback(
			async (e: React.MouseEvent<HTMLInputElement>) => {
				if (e.button === 0) {
					const percent = Number(e.currentTarget.value) / 100;

					playerStore.setSeeking(false);

					const duration = await diva.getDuration();
					if (duration !== undefined) {
						await diva.setCurrentTime(duration * percent);
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
				css={{ blockSize: 32 }}
				disabled={playQueueStore.isEmpty}
			/>
		);
	},
);
