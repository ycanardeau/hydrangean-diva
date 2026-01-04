import {
	type IPlayQueueItemStore,
	type IPlayQueueStore,
	RepeatMode,
} from '@/features/media-player.play-queue.abstractions';
import type { IMiniPlayerStore } from '@/features/media-player.player/interfaces/IMiniPlayerStore';
import type { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import type { IPlayerController, TimeEvent } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export class MiniPlayerStore implements IMiniPlayerStore {
	@observable interacted = false;

	constructor(
		private readonly player: IPlayerStore,
		private readonly playQueue: IPlayQueueStore,
	) {
		makeObservable(this);
	}

	@computed get controller(): IPlayerController {
		return this.player.controller;
	}

	@computed get currentItem(): IPlayQueueItemStore | undefined {
		return this.playQueue.currentItem;
	}

	@action.bound interact(): void {
		this.interacted = true;
	}

	@action.bound async onLoaded(): Promise<void> {
		if (!this.interacted) {
			return;
		}

		await this.controller.play();
	}

	@action.bound onPlay(): void {
		this.player.onPlay();
	}

	@action.bound onPause(): void {
		this.player.onPause();
	}

	@action.bound async onEnded(): Promise<void> {
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

	@action.bound onTimeUpdate(event: TimeEvent): void {
		this.player.onTimeUpdate(event);
	}

	@action.bound onControllerChange(value: IPlayerController): void {
		this.player.onControllerChange(value);
	}
}
