import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';
import type { IPlaylistStore } from '@/features/media-player.playlists/interfaces/IPlaylistStore';
import type { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlaylistItemStore implements IPlaylistItemStore {
	static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		readonly playQueue: IPlayQueueStore,
		readonly playlist: IPlaylistStore,
		readonly dto: PlayQueueItemDto,
	) {
		makeObservable(this);

		this.id = PlaylistItemStore.nextId++;
	}

	static fromDto(
		playQueue: IPlayQueueStore,
		playlist: IPlaylistStore,
		dto: PlayQueueItemDto,
	): IPlaylistItemStore {
		return new PlaylistItemStore(playQueue, playlist, dto);
	}

	get url(): string {
		return this.dto.url;
	}

	get type(): PlayerType {
		return this.dto.type;
	}

	get videoId(): string {
		return this.dto.videoId;
	}

	get title(): string {
		return this.dto.title;
	}

	@computed get isCurrent(): boolean {
		return false; /* TODO */
	}

	@computed get index(): number {
		return this.playlist.items.indexOf(this);
	}

	@computed get isFirst(): boolean {
		return this.index === 0;
	}

	@computed get isLast(): boolean {
		return this.index === this.playlist.items.length - 1;
	}

	@computed get canMoveToTop(): boolean {
		return !this.isFirst;
	}

	@computed get canMoveToBottom(): boolean {
		return !this.isLast;
	}

	@computed get canRemoveToTop(): boolean {
		return !this.isFirst;
	}

	@computed get canRemoveOthers(): boolean {
		return this.playlist.hasMultipleItems;
	}

	@action.bound unselect(): void {
		this.isSelected = false;
	}

	@action.bound select(): void {
		this.isSelected = true;
	}

	@action.bound toggleSelected(): void {
		this.isSelected = !this.isSelected;
	}

	@action.bound play(): Promise<void> {
		this.playQueue.clearAndSetItems([
			this.playQueue.createItemFromDto(this.dto),
		]);
		return Promise.resolve();
	}

	@action.bound remove(): Promise<void> {
		return this.playlist.removeItems([this]);
	}

	@action.bound playFirst(): Promise<void> {
		return this.playQueue.playFirst([
			this.playQueue.createItemFromDto(this.dto),
		]);
	}

	@action.bound playNext(): Promise<void> {
		return this.playQueue.playNext([
			this.playQueue.createItemFromDto(this.dto),
		]);
	}

	@action.bound addToPlayQueue(): Promise<void> {
		return this.playQueue.addItems([
			this.playQueue.createItemFromDto(this.dto),
		]);
	}

	@action.bound moveToTop(): void {
		this.playlist.moveItem(this, 0);
	}

	@action.bound moveToBottom(): void {
		this.playlist.moveItem(this, this.playlist.items.length - 1);
	}

	@action.bound removeToTop(): Promise<void> {
		return this.playlist.removeItemsAbove(this);
	}

	@action.bound removeOthers(): Promise<void> {
		return this.playlist.removeOtherItems(this);
	}
}
