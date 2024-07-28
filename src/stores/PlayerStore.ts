import { TimeEvent } from '@aigamo/nostalgic-diva';
import { action, makeObservable, observable } from 'mobx';

export class PlayerStore {
	@observable playing = false;
	@observable percent = 0;
	@observable seeking = false;

	constructor() {
		makeObservable(this);
	}

	@action setPlaying(value: boolean): void {
		this.playing = value;
	}

	@action setPercent(value: number): void {
		this.percent = value;
	}

	@action setSeeking(value: boolean): void {
		this.seeking = value;
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
