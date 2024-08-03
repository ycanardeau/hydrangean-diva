import {
	PlayQueueItemDto,
	PlayQueueItemStore,
} from '@/stores/PlayQueueItemStore';

export interface IPlayQueueStore {
	items: PlayQueueItemStore[];
	createItem(dto: PlayQueueItemDto): PlayQueueItemStore;
	readonly currentItem: PlayQueueItemStore | undefined;
	readonly hasMultipleItems: boolean;
	setCurrentItem(item: PlayQueueItemStore | undefined): void;
	playNext(items: PlayQueueItemStore[]): Promise<void>;
	addItems(items: PlayQueueItemStore[]): Promise<void>;
	playFirst(items: PlayQueueItemStore[]): Promise<void>;
	moveItem(item: PlayQueueItemStore, index: number): void;
	removeItems(items: PlayQueueItemStore[]): Promise<void>;
	removeItemsAbove(item: PlayQueueItemStore): Promise<void>;
	removeOtherItems(item: PlayQueueItemStore): Promise<void>;
}
