import {
	IPlayQueueItemStore,
	PlayQueueItemDto,
} from '@/stores/IPlayQueueItemStore';

export interface IPlayQueueStore {
	items: IPlayQueueItemStore[];
	createItem(dto: PlayQueueItemDto): IPlayQueueItemStore;
	readonly currentItem: IPlayQueueItemStore | undefined;
	readonly hasMultipleItems: boolean;
	setCurrentItem(item: IPlayQueueItemStore | undefined): void;
	playNext(items: IPlayQueueItemStore[]): Promise<void>;
	addItems(items: IPlayQueueItemStore[]): Promise<void>;
	playFirst(items: IPlayQueueItemStore[]): Promise<void>;
	moveItem(item: IPlayQueueItemStore, index: number): void;
	removeItems(items: IPlayQueueItemStore[]): Promise<void>;
	removeItemsAbove(item: IPlayQueueItemStore): Promise<void>;
	removeOtherItems(item: IPlayQueueItemStore): Promise<void>;
}
