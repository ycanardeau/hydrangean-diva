import type { IStateStore } from '@aigamo/route-sphere';
import { action, computed, makeObservable, observable } from 'mobx';

interface PlaylistListLocalStorageState {
	items?: {
		id: string;
		name: string;
	}[];
}

class PlaylistListLocalStorageStateStore implements IStateStore<PlaylistListLocalStorageState> {
	constructor(private readonly playlistList: PlaylistListStore) {
		makeObservable(this);
	}

	@computed.struct get state(): PlaylistListLocalStorageState {
		return {
			items: this.playlistList.items.map((item) => ({
				id: item.id,
				name: item.name,
			})),
		};
	}
	set state(value: PlaylistListLocalStorageState) {
		this.playlistList.items =
			value.items?.map(
				(item) => new PlaylistListItemStore(item.id, item.name),
			) ?? [];
	}

	validateState(state: unknown): state is PlaylistListLocalStorageState {
		return true /* TODO: implement */;
	}
}

export class PlaylistListItemStore {
	@observable id: string;
	@observable name: string;

	constructor(id: string, name: string) {
		makeObservable(this);

		this.id = id;
		this.name = name;
	}
}

export class PlaylistListStore {
	readonly localStorageState: PlaylistListLocalStorageStateStore;
	@observable
	items: PlaylistListItemStore[] = [];

	constructor() {
		makeObservable(this);

		this.localStorageState = new PlaylistListLocalStorageStateStore(this);
	}

	@action.bound async addItem(item: PlaylistListItemStore): Promise<void> {
		this.items.push(item);
	}
}
