import { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, observable } from 'mobx';

export class PlayQueueItemStore implements IPlayQueueItemStore {
	static nextId = 1;

	readonly id: number;
	isSelected = false;

	constructor(
		readonly observableStateProvider: IObservableStateProvider,
		readonly playQueue: IPlayQueueStore,
		readonly dto: PlayQueueItemDto,
	) {
		this.id = PlayQueueItemStore.nextId++;

		observableStateProvider.makeObservable(this, {
			isSelected: observable,
			isCurrent: computed,
			index: computed,
			isFirst: computed,
			isLast: computed,
			canMoveToTop: computed,
			canMoveToBottom: computed,
			canRemoveToTop: computed,
			canRemoveOthers: computed,
			unselect: action,
			select: action,
			toggleSelected: action.bound,
			play: action,
			remove: action.bound,
			playFirst: action.bound,
			playNext: action.bound,
			addToPlayQueue: action.bound,
			moveToTop: action.bound,
			moveToBottom: action.bound,
			removeToTop: action.bound,
			removeOthers: action.bound,
		});
	}

	static fromDto(
		observableStateProvider: IObservableStateProvider,
		playQueue: IPlayQueueStore,
		dto: PlayQueueItemDto,
	): IPlayQueueItemStore {
		return new PlayQueueItemStore(observableStateProvider, playQueue, dto);
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

	get isCurrent(): boolean {
		return this.playQueue.currentItem === this;
	}

	get index(): number {
		return this.playQueue.items.indexOf(this);
	}

	get isFirst(): boolean {
		return this.index === 0;
	}

	get isLast(): boolean {
		return this.index === this.playQueue.items.length - 1;
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
		return this.playQueue.hasMultipleItems;
	}

	clone(): IPlayQueueItemStore {
		return this.playQueue.createItem(this.dto);
	}

	unselect(): void {
		this.isSelected = false;
	}

	select(): void {
		this.isSelected = true;
	}

	toggleSelected(): void {
		this.isSelected = !this.isSelected;
	}

	play(): void {
		this.playQueue.setCurrentItem(this);
	}

	remove(): Promise<void> {
		return this.playQueue.removeItems([this]);
	}

	async playFirst(): Promise<void> {
		await this.playQueue.playFirst([this.clone()]);
	}

	async playNext(): Promise<void> {
		await this.playQueue.playNext([this.clone()]);
	}

	async addToPlayQueue(): Promise<void> {
		await this.playQueue.addItems([this.clone()]);
	}

	moveToTop(): void {
		this.playQueue.moveItem(this, 0);
	}

	moveToBottom(): void {
		this.playQueue.moveItem(this, this.playQueue.items.length - 1);
	}

	removeToTop(): Promise<void> {
		return this.playQueue.removeItemsAbove(this);
	}

	removeOthers(): Promise<void> {
		return this.playQueue.removeOtherItems(this);
	}
}
