import { IObservableStateProvider } from '@/stores/IObservableStateProvider';
import { TimeEvent } from '@aigamo/nostalgic-diva';
import { action, observable } from 'mobx';

export class PlayerStore {
	playing = false;
	percent = 0;
	seeking = false;

	constructor(observableStateProvider: IObservableStateProvider) {
		observableStateProvider.makeObservable(this, {
			playing: observable,
			percent: observable,
			seeking: observable,
			setPlaying: action,
			setPercent: action,
			setSeeking: action,
			onPlay: action.bound,
			onPause: action.bound,
			onEnded: action.bound,
			onTimeUpdate: action.bound,
		});
	}

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
