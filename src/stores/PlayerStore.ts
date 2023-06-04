import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, makeObservable, observable } from 'mobx';

export interface Video {
	type: PlayerType;
	videoId: string;
	title: string;
}

export class PlayerStore {
	@observable selectedVideo?: Video;
	@observable playing = false;

	constructor() {
		makeObservable(this);
	}

	@action setSelectedVideo(value: Video | undefined): void {
		this.selectedVideo = value;
	}

	@action onPlay(): void {
		this.playing = true;
	}

	@action onPause(): void {
		this.playing = false;
	}
}
