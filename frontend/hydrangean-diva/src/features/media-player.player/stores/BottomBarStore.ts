import { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import {
	IPlayQueueItemStore,
	RepeatMode,
} from '@/features/media-player.play-queue.abstractions';
import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { IPlayerController } from '@aigamo/nostalgic-diva';
import { action, computed } from 'mobx';

export class BottomBarStore implements IBottomBarStore {
	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly playerStore: IPlayerStore,
		private readonly playQueueStore: IPlayQueueStore,
	) {
		observableStateProvider.makeObservable(this, {
			controller: computed,
			playing: computed,
			percent: computed,
			canSeek: computed,
			currentItem: computed,
			repeat: computed,
			shuffle: computed,
			canToggleRepeat: computed,
			canToggleShuffle: computed,
			canPlay: computed,
			canPause: computed,
			canPrevious: computed,
			canNext: computed,
			canSkipBack10: computed,
			canSkipForward30: computed,
			canRemoveFromPlayQueue: computed,
			setPercent: action.bound,
			setSeeking: action.bound,
			toggleRepeat: action.bound,
			toggleShuffle: action.bound,
			play: action.bound,
			pause: action.bound,
			previous: action.bound,
			next: action.bound,
			skipBack10: action.bound,
			skipForward30: action.bound,
			removeFromPlayQueue: action.bound,
		});
	}

	get controller(): IPlayerController {
		return this.playerStore.controller;
	}

	get playing(): boolean {
		return this.playerStore.playing;
	}

	get percent(): number {
		return this.playerStore.percent;
	}

	get canSeek(): boolean {
		return (
			!this.playQueueStore.isEmpty &&
			this.controller.supports('setCurrentTime')
		);
	}

	get currentItem(): IPlayQueueItemStore | undefined {
		return this.playQueueStore.currentItem;
	}

	get repeat(): RepeatMode {
		return this.playQueueStore.repeat;
	}

	get shuffle(): boolean {
		return this.playQueueStore.shuffle;
	}

	get canToggleRepeat(): boolean {
		return true;
	}

	get canToggleShuffle(): boolean {
		return false /* TODO */;
	}

	get canPlay(): boolean {
		return this.playQueueStore.canPlay && this.controller.supports('play');
	}

	get canPause(): boolean {
		return (
			this.playQueueStore.canPause && this.controller.supports('pause')
		);
	}

	get canPrevious(): boolean {
		return !this.playQueueStore.isEmpty;
	}

	get canNext(): boolean {
		return this.playQueueStore.hasNextItem;
	}

	get canSkipBack10(): boolean {
		return this.canSeek;
	}

	get canSkipForward30(): boolean {
		return this.canSeek;
	}

	get canRemoveFromPlayQueue(): boolean {
		return !this.playQueueStore.isEmpty;
	}

	setPercent(value: number): void {
		this.playerStore.setPercent(value);
	}

	setSeeking(value: boolean): void {
		this.playerStore.setSeeking(value);
	}

	toggleRepeat(): void {
		this.playQueueStore.toggleRepeat();
	}

	toggleShuffle(): void {
		this.playQueueStore.toggleShuffle();
	}

	play(): Promise<void> {
		return this.controller.play();
	}

	pause(): Promise<void> {
		return this.controller.pause();
	}

	async previous(): Promise<void> {
		if (this.playQueueStore.hasPreviousItem) {
			const currentTime = await this.controller.getCurrentTime();
			if (currentTime === undefined || currentTime < 5) {
				await this.playQueueStore.previous();
			} else {
				await this.controller.setCurrentTime(0);
			}
		} else {
			await this.controller.setCurrentTime(0);
		}
	}

	next(): Promise<void> {
		return this.playQueueStore.next();
	}

	async skipBack10(): Promise<void> {
		const currentTime = await this.controller.getCurrentTime();

		if (currentTime !== undefined) {
			await this.controller.setCurrentTime(currentTime - 10);
		}
	}

	async skipForward30(): Promise<void> {
		const currentTime = await this.controller.getCurrentTime();

		if (currentTime !== undefined) {
			await this.controller.setCurrentTime(currentTime + 30);
		}
	}

	async removeFromPlayQueue(): Promise<void> {
		if (this.currentItem !== undefined) {
			await this.playQueueStore.removeItems([this.currentItem]);
		}
	}
}
