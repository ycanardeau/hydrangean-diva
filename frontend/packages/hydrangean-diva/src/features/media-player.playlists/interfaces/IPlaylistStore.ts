import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';

export interface IPlaylistStore {
	readonly items: IPlaylistItemStore[];
	createItemFromDto(dto: PlayQueueItemDto): IPlaylistItemStore;
	readonly isEmpty: boolean;
	readonly hasMultipleItems: boolean;
	readonly selectedItems: IPlaylistItemStore[];
	readonly allItemsSelected: boolean;
	readonly canAddSelectedItems: boolean;
	readonly canPlaySelectedItemsNext: boolean;
	readonly canRemoveSelectedItems: boolean;
	setItems(value: IPlaylistItemStore[]): void;
	unselectAll(): void;
	selectAll(): void;
	playSelectedItemsNext(): Promise<void>;
	addItems(items: IPlaylistItemStore[]): Promise<void>;
	addSelectedItems(): Promise<void>;
	moveItem(item: IPlaylistItemStore, index: number): void;
	removeItems(items: IPlaylistItemStore[]): Promise<void>;
	removeSelectedItems(): Promise<void>;
	removeItemsAbove(item: IPlaylistItemStore): Promise<void>;
	removeOtherItems(item: IPlaylistItemStore): Promise<void>;
	addItemFromDto(dto: PlayQueueItemDto): Promise<void>;
}
