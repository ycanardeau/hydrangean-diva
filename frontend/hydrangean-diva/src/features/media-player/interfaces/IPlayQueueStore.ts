import { IPlayQueueItemStore } from '@/features/media-player/interfaces/IPlayQueueItemStore';
import { PlayQueueItemDto } from '@/features/media-player/interfaces/PlayQueueItemDto';
import { RepeatMode } from '@/features/media-player/interfaces/RepeatMode';

export interface IPlayQueueStore {
	readonly interacted: boolean;
	readonly items: IPlayQueueItemStore[];
	readonly repeat: RepeatMode;
	readonly shuffle: boolean;
	createItem(dto: PlayQueueItemDto): IPlayQueueItemStore;
	readonly isEmpty: boolean;
	readonly currentItem: IPlayQueueItemStore | undefined;
	readonly canPlay: boolean;
	readonly hasMultipleItems: boolean;
	readonly hasPreviousItem: boolean;
	readonly hasNextItem: boolean;
	readonly isLastItem: boolean;
	allItemsSelected: boolean;
	readonly selectedItems: IPlayQueueItemStore[];
	setItems(value: IPlayQueueItemStore[]): void;
	clear(): void;
	setCurrentItem(item: IPlayQueueItemStore | undefined): void;
	playNext(items: IPlayQueueItemStore[]): Promise<void>;
	playSelectedItemsNext(): Promise<void>;
	addItems(items: IPlayQueueItemStore[]): Promise<void>;
	addSelectedItems(): Promise<void>;
	playFirst(items: IPlayQueueItemStore[]): Promise<void>;
	moveItem(item: IPlayQueueItemStore, index: number): void;
	removeItems(items: IPlayQueueItemStore[]): Promise<void>;
	removeSelectedItems(): Promise<void>;
	removeItemsAbove(item: IPlayQueueItemStore): Promise<void>;
	removeOtherItems(item: IPlayQueueItemStore): Promise<void>;
	toggleRepeat(): void;
	toggleShuffle(): void;
	previous(): Promise<void>;
	next(): Promise<void>;
	goToFirst(): Promise<void>;
}
