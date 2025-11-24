import { IPlayerController, TimeEvent } from '@aigamo/nostalgic-diva';

export interface IPlayerStore {
	readonly controller: IPlayerController;
	readonly playing: boolean;
	readonly percent: number;
	setPercent(value: number): void;
	setSeeking(value: boolean): void;
	onControllerChange(value: IPlayerController): void;
	onPlay(): void;
	onPause(): void;
	onEnded(): void;
	onTimeUpdate({ percent }: TimeEvent): void;
}
