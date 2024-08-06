import { IObservableStateProvider } from '@/stores/IObservableStateProvider';
import {
	IPlayQueueItemStore,
	PlayQueueItemDto,
} from '@/stores/IPlayQueueItemStore';
import { IPlayQueueStore } from '@/stores/IPlayQueueStore';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, observable } from 'mobx';

export class PlayQueueItemStore implements IPlayQueueItemStore {
	static nextId = 1;

	readonly id: number;
	isSelected = false;

	constructor(
		readonly observableStateProvider: IObservableStateProvider,
		readonly playQueueStore: IPlayQueueStore,
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
		playQueueStore: PlayQueueStore,
		dto: PlayQueueItemDto,
	): IPlayQueueItemStore {
		return new PlayQueueItemStore(
			observableStateProvider,
			playQueueStore,
			dto,
		);
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

	clone(): IPlayQueueItemStore {
		return this.playQueueStore.createItem(this.dto);
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
