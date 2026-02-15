import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';

export interface IPlaylistListStore {
	readonly items: IPlaylistListItemStore[];
	createItem(name: string): IPlaylistListItemStore;
	setItems(value: IPlaylistListItemStore[]): void;
	addItem(item: IPlaylistListItemStore): Promise<void>;
	removeItem(item: IPlaylistListItemStore): Promise<void>;
}
