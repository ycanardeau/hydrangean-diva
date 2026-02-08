import { getOrAddSchema } from '@/features/common/stores/getOrAddSchema';
import {
	type PlayQueueItemDto,
	PlayQueueItemDtoSchema,
} from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';
import type { IPlaylistStore } from '@/features/media-player.playlists/interfaces/IPlaylistStore';
import { PlaylistItemStore } from '@/features/media-player.playlists/stores/PlaylistItemStore';
import type { IStateStore } from '@aigamo/route-sphere';
import type { JSONSchemaType } from 'ajv';
import { action, computed, makeObservable, observable } from 'mobx';

interface PlaylistLocalStorageState {
	readonly version?: '1.0';
	readonly items?: PlayQueueItemDto[];
}

const PlaylistLocalStorageStateSchema: JSONSchemaType<PlaylistLocalStorageState> =
	{
		type: 'object',
		properties: {
			version: {
				type: 'string',
				nullable: true,
			},
			items: {
				type: 'array',
				nullable: true,
				items: PlayQueueItemDtoSchema,
			},
		},
	};

class PlaylistLocalStorageStateStore implements IStateStore<PlaylistLocalStorageState> {
	constructor(private readonly playlist: PlaylistStore) {
		makeObservable(this);
	}

	@computed.struct get state(): PlaylistLocalStorageState {
		return {
			version: '1.0',
			items: this.playlist.items.map((item) => item.dto),
		};
	}
	set state(value: PlaylistLocalStorageState) {
		this.playlist.items =
			value.items?.map((item) => this.playlist.createItem(item)) ?? [];
	}

	validateState(state: unknown): state is PlaylistLocalStorageState {
		return getOrAddSchema(
			PlaylistLocalStorageStateSchema,
			'PlaylistLocalStorageState',
		)(state);
	}
}

export class PlaylistStore implements IPlaylistStore {
	readonly localStorageState: PlaylistLocalStorageStateStore;
	@observable items: IPlaylistItemStore[] = [];

	constructor() {
		makeObservable(this);

		this.localStorageState = new PlaylistLocalStorageStateStore(this);
	}

	createItem(dto: PlayQueueItemDto): IPlaylistItemStore {
		return PlaylistItemStore.fromDto(this, {
			url: dto.url,
			type: dto.type,
			videoId: dto.videoId,
			title: dto.title,
		});
	}

	@computed get isEmpty(): boolean {
		return this.items.length === 0;
	}

	@computed get selectedItems(): IPlaylistItemStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	@computed get allItemsSelected(): boolean {
		return this.selectedItems.length === this.items.length;
	}

	@action.bound setItems(value: IPlaylistItemStore[]): void {
		this.items = value;
	}

	@action.bound unselectAll(): void {
		for (const item of this.items) {
			item.unselect();
		}
	}

	@action.bound selectAll(): void {
		for (const item of this.items) {
			item.select();
		}
	}
}
