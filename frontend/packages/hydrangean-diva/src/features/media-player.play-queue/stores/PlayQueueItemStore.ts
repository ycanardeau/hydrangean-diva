import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import type { IPlayQueueTableRowStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueTableRowStore';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlayQueueItemStore
	implements IPlayQueueItemStore, IPlayQueueTableRowStore
{
	static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		readonly playQueue: IPlayQueueStore,
		readonly dto: PlayQueueItemDto,
	) {
		this.id = PlayQueueItemStore.nextId++;

		makeObservable(this);
	}

	static fromDto(
		playQueue: IPlayQueueStore,
		dto: PlayQueueItemDto,
	): IPlayQueueItemStore {
		return new PlayQueueItemStore(playQueue, dto);
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
		return this.playQueue.currentItem === this;
	}

	@computed get index(): number {
		return this.playQueue.items.indexOf(this);
	}

	@computed get isFirst(): boolean {
		return this.index === 0;
	}

	@computed get isLast(): boolean {
		return this.index === this.playQueue.items.length - 1;
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
		return this.playQueue.hasMultipleItems;
	}

	clone(): IPlayQueueItemStore {
		return this.playQueue.createItem(this.dto);
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

	@action.bound play(): void {
		this.playQueue.setCurrentItem(this);
	}

	@action.bound remove(): Promise<void> {
		return this.playQueue.removeItems([this]);
	}

	@action.bound async playFirst(): Promise<void> {
		await this.playQueue.playFirst([this.clone()]);
	}

	@action.bound async playNext(): Promise<void> {
		await this.playQueue.playNext([this.clone()]);
	}

	@action.bound async addToPlayQueue(): Promise<void> {
		await this.playQueue.addItems([this.clone()]);
	}

	@action.bound moveToTop(): void {
		this.playQueue.moveItem(this, 0);
	}

	@action.bound moveToBottom(): void {
		this.playQueue.moveItem(this, this.playQueue.items.length - 1);
	}

	@action.bound removeToTop(): Promise<void> {
		return this.playQueue.removeItemsAbove(this);
	}

	@action.bound removeOthers(): Promise<void> {
		return this.playQueue.removeOtherItems(this);
	}
}
