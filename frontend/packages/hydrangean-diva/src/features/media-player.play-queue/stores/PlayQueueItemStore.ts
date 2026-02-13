import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlayQueueItemStore implements IPlayQueueItemStore {
	static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		readonly playQueue: IPlayQueueStore,
		readonly dto: PlayQueueItemDto,
	) {
		makeObservable(this);

		this.id = PlayQueueItemStore.nextId++;
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
		return this.playQueue.createItemFromDto(this.dto);
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
		this.playQueue.setCurrentItem(this);
		return Promise.resolve();
	}

	@action.bound remove(): Promise<void> {
		return this.playQueue.removeItems([this]);
	}

	@action.bound playFirst(): Promise<void> {
		return this.playQueue.playFirst([this.clone()]);
	}

	@action.bound playNext(): Promise<void> {
		return this.playQueue.playNext([this.clone()]);
	}

	@action.bound addToPlayQueue(): Promise<void> {
		return this.playQueue.addItems([this.clone()]);
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
