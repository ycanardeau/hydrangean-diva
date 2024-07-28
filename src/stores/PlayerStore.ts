import { TimeEvent } from '@aigamo/nostalgic-diva';

export class PlayerStore {
	playing = false;
	percent = 0;
	seeking = false;

	setPlaying(value: boolean): void {
		this.playing = value;
	}

	setPercent(value: number): void {
		this.percent = value;
	}

	setSeeking(value: boolean): void {
		this.seeking = value;
	}

	onPlay(): void {
		this.playing = true;
	}

	onPause(): void {
		this.playing = false;
	}

	onEnded(): void {
		this.playing = false;
	}

	onTimeUpdate({ percent }: TimeEvent): void {
		if (percent !== undefined) {
			if (!this.seeking) {
				this.percent = percent;
			}
		}

		// TODO
	}
}
