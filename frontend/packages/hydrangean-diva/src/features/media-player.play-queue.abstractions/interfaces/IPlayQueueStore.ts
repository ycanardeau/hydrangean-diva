import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { PlayQueueDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueDto';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import type { IStateStore } from '@aigamo/route-sphere';

export interface IPlayQueueStore {
	readonly localStorageState: IStateStore<PlayQueueDto>;
	readonly items: IPlayQueueItemStore[];
	readonly repeat: RepeatMode;
	readonly shuffle: boolean;
	createItem(dto: PlayQueueItemDto): IPlayQueueItemStore;
	readonly isEmpty: boolean;
	readonly canClear: boolean;
	readonly currentItem: IPlayQueueItemStore | undefined;
	readonly canPlay: boolean;
	readonly canPause: boolean;
	readonly hasMultipleItems: boolean;
	readonly hasPreviousItem: boolean;
	readonly hasNextItem: boolean;
	readonly isLastItem: boolean;
	setItems(value: IPlayQueueItemStore[]): void;
	clear(): void;
	setCurrentItem(item: IPlayQueueItemStore | undefined): void;
	clearAndSetItems(items: IPlayQueueItemStore[]): void;
	playNext(items: IPlayQueueItemStore[]): Promise<void>;
	addItems(items: IPlayQueueItemStore[]): Promise<void>;
	playFirst(items: IPlayQueueItemStore[]): Promise<void>;
	moveItem(item: IPlayQueueItemStore, index: number): void;
	goToFirst(): Promise<void>;
	removeItems(items: IPlayQueueItemStore[]): Promise<void>;
	removeItemsAbove(item: IPlayQueueItemStore): Promise<void>;
	removeOtherItems(item: IPlayQueueItemStore): Promise<void>;
	toggleRepeat(): void;
	toggleShuffle(): void;
	previous(): Promise<void>;
	next(): Promise<void>;
}
