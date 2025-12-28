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
		private readonly playerStore: IPlayerStore,
		private readonly playQueueStore: IPlayQueueStore,
		private readonly diva: IPlayerController,
	) {
		observableStateProvider.makeObservable(this, {
			currentItem: computed,
			onLoaded: action.bound,
			onPlay: action.bound,
			onPause: action.bound,
			onEnded: action.bound,
			onTimeUpdate: action.bound,
			onControllerChange: action.bound,
		});
	}

	get currentItem(): IPlayQueueItemStore | undefined {
		return this.playQueueStore.currentItem;
	}

	async onLoaded(): Promise<void> {
		if (!this.playQueueStore.interacted) {
			return;
		}

		await this.diva.play();
	}

	onPlay(): void {
		this.playerStore.onPlay();
	}

	onPause(): void {
		this.playerStore.onPause();
	}

	async onEnded(): Promise<void> {
		switch (this.playQueueStore.repeat) {
			case RepeatMode.One:
				await this.diva.setCurrentTime(0);
				break;

			case RepeatMode.Off:
			case RepeatMode.All:
				if (this.playQueueStore.isLastItem) {
					switch (this.playQueueStore.repeat) {
						case RepeatMode.Off:
							this.playerStore.onEnded();
							break;

						case RepeatMode.All:
							if (this.playQueueStore.hasMultipleItems) {
								await this.playQueueStore.goToFirst();
							} else {
								await this.diva.setCurrentTime(0);
							}
							break;
					}
				} else {
					await this.playQueueStore.next();
				}
				break;
		}
	}

	onTimeUpdate(event: TimeEvent): void {
		this.playerStore.onTimeUpdate(event);
	}

	onControllerChange(value: IPlayerController): void {
		this.playerStore.onControllerChange(value);
	}
}
