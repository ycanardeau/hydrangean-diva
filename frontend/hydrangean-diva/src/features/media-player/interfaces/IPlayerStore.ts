import { TimeEvent } from '@aigamo/nostalgic-diva';

export interface IPlayerStore {
	readonly playing: boolean;
	readonly percent: number;
	setPercent(value: number): void;
	setSeeking(value: boolean): void;
	onPlay(): void;
	onPause(): void;
	onEnded(): void;
	onTimeUpdate({ percent }: TimeEvent): void;
}
