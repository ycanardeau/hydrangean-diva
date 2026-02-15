import { getOrAddSchema } from '@/features/common/stores/getOrAddSchema';
import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import type { IPlayerStore } from '@/features/media-player.player.abstractions/interfaces/IPlayerStore';
import type { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
import type { IPlayerController } from '@aigamo/nostalgic-diva';
import type { IStateStore } from '@aigamo/route-sphere';
import type { JSONSchemaType } from 'ajv';
import { action, computed, makeObservable, observable } from 'mobx';

interface BottomBarLocalStorageState {
	repeat?: RepeatMode;
	shuffle?: boolean;
}

export const BottomBarLocalStorageStateSchema: JSONSchemaType<BottomBarLocalStorageState> =
	{
		type: 'object',
		properties: {
			repeat: {
				type: 'string',
				enum: Object.values(RepeatMode),
				nullable: true,
			},
			shuffle: {
				type: 'boolean',
				nullable: true,
			},
		},
	};

class BottomBarLocalStorageStateStore implements IStateStore<BottomBarLocalStorageState> {
	constructor(private readonly bottomBar: BottomBarStore) {
		makeObservable(this);
	}

	@computed.struct get state(): BottomBarLocalStorageState {
		return {
			repeat: this.bottomBar.repeat,
			shuffle: this.bottomBar.shuffle,
		};
	}
	set state(value: BottomBarLocalStorageState) {
		this.bottomBar.repeat = value.repeat ?? RepeatMode.Off;
		this.bottomBar.shuffle = value.shuffle ?? false;
	}

	validateState(state: unknown): state is BottomBarLocalStorageState {
		return getOrAddSchema(
			BottomBarLocalStorageStateSchema,
			'BottomBarLocalStorageState',
		)(state);
	}
}

export class BottomBarStore implements IBottomBarStore {
	readonly localStorageState: BottomBarLocalStorageStateStore;
	@observable repeat = RepeatMode.Off;
	@observable shuffle = false;

	constructor(
		private readonly player: IPlayerStore,
		private readonly playQueue: IPlayQueueStore,
	) {
		makeObservable(this);

		this.localStorageState = new BottomBarLocalStorageStateStore(this);
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
		switch (this.repeat) {
			case RepeatMode.Off:
				this.repeat = RepeatMode.All;
				break;
			case RepeatMode.All:
				this.repeat = RepeatMode.One;
				break;
			case RepeatMode.One:
				this.repeat = RepeatMode.Off;
				break;
		}
	}

	@action.bound toggleShuffle(): void {
		this.shuffle = !this.shuffle;
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
