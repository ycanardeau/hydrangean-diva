import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';
import type { IPlaylistListStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListStore';
import { action, makeObservable, observable } from 'mobx';

export class PlaylistListItemStore implements IPlaylistListItemStore {
	@observable id: string;
	@observable name: string;

	constructor(
		private readonly playlistList: IPlaylistListStore,
		id: string,
		name: string,
	) {
		makeObservable(this);

		this.id = id;
		this.name = name;
	}

	@action.bound async rename(name: string): Promise<void> {
		this.name = name;
	}

	@action.bound remove(): Promise<void> {
		return this.playlistList.removeItem(this);
	}
}
