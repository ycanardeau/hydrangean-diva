import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';

export interface PlayQueueItemDto {
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}

export class PlayQueueItemStore {
	static nextId = 1;

	readonly id: number;
	isSelected = false;

	constructor(
		readonly playQueueStore: PlayQueueStore,
		readonly url: string,
		readonly type: PlayerType,
		readonly videoId: string,
		readonly title: string,
	) {
		this.id = PlayQueueItemStore.nextId++;
	}

	get isCurrent(): boolean {
		return this.playQueueStore.currentItem === this;
	}

	get index(): number {
		return this.playQueueStore.items.indexOf(this);
	}

	get isFirst(): boolean {
		return this.index === 0;
	}

	get isLast(): boolean {
		return this.index === this.playQueueStore.items.length - 1;
	}

	get canMoveToTop(): boolean {
		return !this.isFirst;
	}

	get canMoveToBottom(): boolean {
		return !this.isLast;
	}

	get canRemoveToTop(): boolean {
		return !this.isFirst;
	}

	get canRemoveOthers(): boolean {
		return this.playQueueStore.hasMultipleItems;
	}

	toDto(): PlayQueueItemDto {
		return {
			url: this.url,
			type: this.type,
			videoId: this.videoId,
			title: this.title,
		};
	}

	clone(): PlayQueueItemStore {
		return this.playQueueStore.createItem(this.toDto());
	}

	unselect(): void {
		this.isSelected = false;
	}

	toggleSelected(): void {
		this.isSelected = !this.isSelected;
	}

	play(): void {
		this.playQueueStore.setCurrentItem(this);
	}

	remove(): void {
		this.playQueueStore.removeItems([this]);
	}

	async playFirst(): Promise<void> {
		await this.playQueueStore.playFirst([this.clone()]);
	}

	async playNext(): Promise<void> {
		await this.playQueueStore.playNext([this.clone()]);
	}

	async addToPlayQueue(): Promise<void> {
		await this.playQueueStore.addItems([this.clone()]);
	}

	moveToTop(): void {
		this.playQueueStore.moveItem(this, 0);
	}

	moveToBottom(): void {
		this.playQueueStore.moveItem(
			this,
			this.playQueueStore.items.length - 1,
		);
	}

	removeToTop(): void {
		this.playQueueStore.removeItemsAbove(this);
	}

	removeOthers(): void {
		this.playQueueStore.removeOtherItems(this);
	}
}
