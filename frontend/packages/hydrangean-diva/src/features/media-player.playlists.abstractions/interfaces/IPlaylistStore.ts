import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { IPlaylistItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistItemStore';

export interface IPlaylistStore {
	readonly items: IPlaylistItemStore[];
	createItemFromDto(dto: PlayQueueItemDto): IPlaylistItemStore;
	readonly isEmpty: boolean;
	readonly hasMultipleItems: boolean;
	readonly selectedItems: IPlaylistItemStore[];
	readonly allItemsSelected: boolean;
	setItems(value: IPlaylistItemStore[]): void;
	unselectAll(): void;
	selectAll(): void;
	addItems(items: IPlaylistItemStore[]): Promise<void>;
	moveItem(item: IPlaylistItemStore, index: number): void;
	removeItems(items: IPlaylistItemStore[]): Promise<void>;
	removeItemsAbove(item: IPlaylistItemStore): Promise<void>;
	removeOtherItems(item: IPlaylistItemStore): Promise<void>;
	addItemFromDto(dto: PlayQueueItemDto): Promise<void>;
	playAll(): Promise<void>;
}
