import { PlayQueueItem, PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export interface Video {
	type: PlayerType;
	videoId: string;
	title: string;
}

export class PlayerStore {
	private readonly playQueueStore = new PlayQueueStore();
	@observable playing = false;

	constructor() {
		makeObservable(this);
	}

	@computed get items(): PlayQueueItem[] {
		return this.playQueueStore.items;
	}

	@computed get currentItem(): PlayQueueItem | undefined {
		return this.playQueueStore.currentItem;
	}

	@computed get canPlay(): boolean {
		return this.currentItem !== undefined;
	}

	@computed get canPause(): boolean {
		return this.currentItem !== undefined;
	}

	@action setCurrentItem(item: PlayQueueItem | undefined): void {
		this.playQueueStore.setCurrentItem(item);
	}

	@action setPlaying(value: boolean): void {
		this.playing = value;
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
