import { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import {
	IPlayQueueItemStore,
	IPlayQueueStore,
	RepeatMode,
} from '@/features/media-player.play-queue.abstractions';
import { IMiniPlayerStore } from '@/features/media-player.player/interfaces/IMiniPlayerStore';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { IPlayerController, TimeEvent } from '@aigamo/nostalgic-diva';
import { action, computed } from 'mobx';

export class MiniPlayerStore implements IMiniPlayerStore {
	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly player: IPlayerStore,
		private readonly playQueue: IPlayQueueStore,
	) {
		observableStateProvider.makeObservable(this, {
			controller: computed,
			currentItem: computed,
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

	async onLoaded(): Promise<void> {
		if (!this.playQueue.interacted) {
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
