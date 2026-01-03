import type { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import {
	type IPlayQueueItemStore,
	type IPlayQueueStore,
	RepeatMode,
} from '@/features/media-player.play-queue.abstractions';
import type { IMiniPlayerStore } from '@/features/media-player.player/interfaces/IMiniPlayerStore';
import type { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import type { IPlayerController, TimeEvent } from '@aigamo/nostalgic-diva';
import { action, computed, observable } from 'mobx';

export class MiniPlayerStore implements IMiniPlayerStore {
	interacted = false;

	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly player: IPlayerStore,
		private readonly playQueue: IPlayQueueStore,
	) {
		observableStateProvider.makeObservable(this, {
			interacted: observable,
			controller: computed,
			currentItem: computed,
			interact: action.bound,
			onLoaded: action.bound,
			onPlay: action.bound,
			onPause: action.bound,
			onEnded: action.bound,
			onTimeUpdate: action.bound,
			onControllerChange: action.bound,
		});
	}

	get controller(): IPlayerController {
		return this.player.controller;
	}

	get currentItem(): IPlayQueueItemStore | undefined {
		return this.playQueue.currentItem;
	}

	interact(): void {
		this.interacted = true;
	}

	async onLoaded(): Promise<void> {
		if (!this.interacted) {
			return;
		}

		await this.controller.play();
	}

	onPlay(): void {
		this.player.onPlay();
	}

	onPause(): void {
		this.player.onPause();
	}

	async onEnded(): Promise<void> {
		switch (this.playQueue.repeat) {
			case RepeatMode.One:
				await this.controller.setCurrentTime(0);
				break;

			case RepeatMode.Off:
			case RepeatMode.All:
				if (this.playQueue.isLastItem) {
					switch (this.playQueue.repeat) {
						case RepeatMode.Off:
							this.player.onEnded();
							break;

						case RepeatMode.All:
							if (this.playQueue.hasMultipleItems) {
								await this.playQueue.goToFirst();
							} else {
								await this.controller.setCurrentTime(0);
							}
							break;
					}
				} else {
					await this.playQueue.next();
				}
				break;
		}
	}

	onTimeUpdate(event: TimeEvent): void {
		this.player.onTimeUpdate(event);
	}

	onControllerChange(value: IPlayerController): void {
		this.player.onControllerChange(value);
	}
}
