import type { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import {
	type IPlayerController,
	type TimeEvent,
	nullPlayerController,
} from '@aigamo/nostalgic-diva';
import { action, makeObservable, observable } from 'mobx';

export class PlayerStore implements IPlayerStore {
	@observable controller: IPlayerController = nullPlayerController;
	@observable playing = false;
	@observable percent = 0;
	@observable seeking = false;

	constructor() {
		makeObservable(this);
	}

	@action.bound setPlaying(value: boolean): void {
		this.playing = value;
	}

	@action.bound setPercent(value: number): void {
		this.percent = value;
	}

	@action.bound setSeeking(value: boolean): void {
		this.seeking = value;
	}

	@action.bound onControllerChange(value: IPlayerController): void {
		this.controller = value;
	}

	@action.bound onPlay(): void {
		this.playing = true;
	}

	@action.bound onPause(): void {
		this.playing = false;
	}

	@action.bound onEnded(): void {
		this.playing = false;
	}

	@action.bound onTimeUpdate({ percent }: TimeEvent): void {
		if (percent !== undefined) {
			if (!this.seeking) {
				this.percent = percent;
			}
		}

		// TODO
	}
}
