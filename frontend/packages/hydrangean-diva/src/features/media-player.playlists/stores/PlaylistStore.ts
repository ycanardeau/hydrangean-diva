import { getOrAddSchema } from '@/features/common/stores/getOrAddSchema';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import {
	type PlayQueueItemDto,
	PlayQueueItemDtoSchema,
} from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';
import type { IPlaylistStore } from '@/features/media-player.playlists/interfaces/IPlaylistStore';
import { PlaylistItemStore } from '@/features/media-player.playlists/stores/PlaylistItemStore';
import type { IStateStore } from '@aigamo/route-sphere';
import type { JSONSchemaType } from 'ajv';
import { pull } from 'lodash-es';
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
			value.items?.map((item) => this.playlist.createItemFromDto(item)) ??
			[];
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

	constructor(private readonly playQueue: IPlayQueueStore) {
		makeObservable(this);

		this.localStorageState = new PlaylistLocalStorageStateStore(this);
	}

	createItemFromDto(dto: PlayQueueItemDto): IPlaylistItemStore {
		return PlaylistItemStore.fromDto(this.playQueue, this, {
			url: dto.url,
			type: dto.type,
			videoId: dto.videoId,
			title: dto.title,
		});
	}

	@computed get isEmpty(): boolean {
		return this.items.length === 0;
	}

	@computed get hasMultipleItems(): boolean {
		return this.items.length > 1;
	}

	@computed get selectedItems(): IPlaylistItemStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	@computed get allItemsSelected(): boolean {
		return this.selectedItems.length === this.items.length;
	}

	@computed get hasSelectedItems(): boolean {
		return this.selectedItems.length > 0;
	}

	@computed get selectedItemsOrAllItems(): IPlaylistItemStore[] {
		return this.hasSelectedItems ? this.selectedItems : this.items;
	}

	@computed get canAddSelectedItems(): boolean {
		return !this.isEmpty && this.hasSelectedItems;
	}

	@computed get canPlaySelectedItemsNext(): boolean {
		return !this.isEmpty && this.hasSelectedItems;
	}

	@computed get canRemoveSelectedItems(): boolean {
		return !this.isEmpty && this.hasSelectedItems;
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

	@action.bound async playSelectedItemsNext(): Promise<void> {
		await this.playQueue.playNext(
			this.selectedItemsOrAllItems.map((item) =>
				this.playQueue.createItemFromDto(item.dto),
			),
		);

		this.unselectAll();
	}

	@action.bound async addSelectedItems(): Promise<void> {
		await this.playQueue.addItems(
			this.selectedItemsOrAllItems.map((item) =>
				this.playQueue.createItemFromDto(item.dto),
			),
		);

		this.unselectAll();
	}

	@action.bound async addItems(items: IPlaylistItemStore[]): Promise<void> {
		this.items.push(...items);
	}

	@action.bound moveItem(item: IPlaylistItemStore, index: number): void {
		const element = this.items.splice(this.items.indexOf(item), 1)[0];
		this.items.splice(index, 0, element);
	}

	@action.bound async removeItems(
		items: IPlaylistItemStore[],
	): Promise<void> {
		pull(this.items, ...items);
	}

	@action.bound async removeSelectedItems(): Promise<void> {
		await this.removeItems(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	@action.bound async removeOtherItems(
		item: IPlaylistItemStore,
	): Promise<void> {
		const itemId = item.id;
		return this.removeItems(
			this.items.filter((item) => item.id !== itemId),
		);
	}

	@action.bound async removeItemsAbove(
		item: IPlaylistItemStore,
	): Promise<void> {
		const itemIndex = this.items.indexOf(item);
		return this.removeItems(
			this.items.filter((_, index) => index < itemIndex),
		);
	}

	@action.bound addItemFromDto(dto: PlayQueueItemDto): Promise<void> {
		const item = this.createItemFromDto(dto);

		return this.addItems([item]);
	}

	@action.bound playAll(): Promise<void> {
		this.playQueue.clearAndSetItems(
			this.items.map((item) =>
				this.playQueue.createItemFromDto(item.dto),
			),
		);
		return Promise.resolve();
	}
}
