import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, makeObservable, observable } from 'mobx';

export interface Video {
	type: PlayerType;
	videoId: string;
	title: string;
}

export class PlayerStore {
	@observable currentVideo?: Video;
	@observable playing = false;

	constructor() {
		makeObservable(this);
	}

	@action setCurrentVideo(value: Video | undefined): void {
		this.currentVideo = value;
	}

	@action clearCurrentVideo(): void {
		this.currentVideo = undefined;
		this.playing = false;
	}

	@action onPlay(): void {
		this.playing = true;
	}

	@action onPause(): void {
		this.playing = false;
	}

	@action onEnded(): void {
		this.playing = false;
	}
}
