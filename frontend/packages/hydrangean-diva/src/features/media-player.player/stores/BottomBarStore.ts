import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import type { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import type { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
import type { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import type { IPlayerController } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable } from 'mobx';

export class BottomBarStore implements IBottomBarStore {
	constructor(
		private readonly player: IPlayerStore,
		private readonly playQueue: IPlayQueueStore,
	) {
		makeObservable(this);
	}

	@computed get controller(): IPlayerController {
		return this.player.controller;
	}

	@computed get playing(): boolean {
		return this.player.playing;
	}

	@computed get percent(): number {
		return this.player.percent;
	}

	@computed get canSeek(): boolean {
		return (
			!this.playQueue.isEmpty &&
			this.controller.supports('setCurrentTime')
		);
	}

	@computed get currentItem(): IPlayQueueItemStore | undefined {
		return this.playQueue.currentItem;
	}

	@computed get repeat(): RepeatMode {
		return this.playQueue.repeat;
	}

	@computed get shuffle(): boolean {
		return this.playQueue.shuffle;
	}

	@computed get canToggleRepeat(): boolean {
		return true;
	}

	@computed get canToggleShuffle(): boolean {
		return false /* TODO */;
	}

	@computed get canPlay(): boolean {
		return this.playQueue.canPlay && this.controller.supports('play');
	}

	@computed get canPause(): boolean {
		return this.playQueue.canPause && this.controller.supports('pause');
	}

	@computed get canPrevious(): boolean {
		return !this.playQueue.isEmpty;
	}

	@computed get canNext(): boolean {
		return this.playQueue.hasNextItem;
	}

	@computed get canSkipBack10(): boolean {
		return this.canSeek;
	}

	@computed get canSkipForward30(): boolean {
		return this.canSeek;
	}

	@computed get canRemoveFromPlayQueue(): boolean {
		return !this.playQueue.isEmpty;
	}

	@action.bound setPercent(value: number): void {
		this.player.setPercent(value);
	}

	@action.bound setSeeking(value: boolean): void {
		this.player.setSeeking(value);
	}

	@action.bound toggleRepeat(): void {
		this.playQueue.toggleRepeat();
	}

	@action.bound toggleShuffle(): void {
		this.playQueue.toggleShuffle();
	}

	@action.bound play(): Promise<void> {
		return this.controller.play();
	}

	@action.bound pause(): Promise<void> {
		return this.controller.pause();
	}

	@action.bound async previous(): Promise<void> {
		if (this.playQueue.hasPreviousItem) {
			const currentTime = await this.controller.getCurrentTime();
			if (currentTime === undefined || currentTime < 5) {
				await this.playQueue.previous();
			} else {
				await this.controller.setCurrentTime(0);
			}
		} else {
			await this.controller.setCurrentTime(0);
		}
	}

	@action.bound next(): Promise<void> {
		return this.playQueue.next();
	}

	@action.bound async skipBack10(): Promise<void> {
		const currentTime = await this.controller.getCurrentTime();

		if (currentTime !== undefined) {
			await this.controller.setCurrentTime(currentTime - 10);
		}
	}

	@action.bound async skipForward30(): Promise<void> {
		const currentTime = await this.controller.getCurrentTime();

		if (currentTime !== undefined) {
			await this.controller.setCurrentTime(currentTime + 30);
		}
	}

	@action.bound async removeFromPlayQueue(): Promise<void> {
		if (this.currentItem !== undefined) {
			await this.playQueue.removeItems([this.currentItem]);
		}
	}
}
