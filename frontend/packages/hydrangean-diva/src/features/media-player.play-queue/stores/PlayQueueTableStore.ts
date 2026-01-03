import type { IPlayQueueTableRowStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueTableRowStore';
import type { IPlayQueueTableStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueTableStore';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { PlayQueueTableRowStore } from '@/features/media-player.play-queue/stores/PlayQueueTableRowStore';
import { pull } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlayQueueTableStore implements IPlayQueueTableStore {
	@observable items: IPlayQueueTableRowStore[] = [];
	@observable currentId: number | undefined;
	@observable repeat = RepeatMode.Off;
	@observable shuffle = false;

	constructor() {
		makeObservable(this);
	}

	createItem(dto: PlayQueueItemDto): IPlayQueueTableRowStore {
		return PlayQueueTableRowStore.fromDto(this, {
			url: dto.url,
			type: dto.type,
			videoId: dto.videoId,
			title: dto.title,
		});
	}

	@computed get isEmpty(): boolean {
		return this.items.length === 0;
	}

	@computed get canClear(): boolean {
		return !this.isEmpty;
	}

	@computed get currentItem(): IPlayQueueTableRowStore | undefined {
		return this.items.find((item) => item.id === this.currentId);
	}

	@computed get canPlay(): boolean {
		return this.currentItem !== undefined;
	}

	@computed get canPause(): boolean {
		return this.currentItem !== undefined;
	}

	@computed get hasMultipleItems(): boolean {
		return this.items.length > 1;
	}

	@computed get currentIndex(): number | undefined {
		return this.currentId !== undefined
			? this.items.findIndex((item) => item.id === this.currentId)
			: undefined;
	}
	set currentIndex(value: number | undefined) {
		this.currentId =
			value !== undefined ? this.items.at(value)?.id : undefined;
	}

	@computed get hasPreviousItem(): boolean {
		return (
			this.hasMultipleItems &&
			this.currentIndex !== undefined &&
			this.currentIndex > 0
		);
	}

	@computed get hasNextItem(): boolean {
		return (
			this.hasMultipleItems &&
			this.currentIndex !== undefined &&
			this.currentIndex < this.items.length - 1
		);
	}

	@computed get isLastItem(): boolean {
		return (
			this.currentIndex !== undefined &&
			this.currentIndex === this.items.length - 1
		);
	}

	@computed get selectedItems(): IPlayQueueTableRowStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	@computed get allItemsSelected(): boolean {
		return this.selectedItems.length === this.items.length;
	}

	@computed get hasSelectedItems(): boolean {
		return this.selectedItems.length > 0;
	}

	@computed get selectedItemsOrAllItems(): IPlayQueueTableRowStore[] {
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

	@action.bound setItems(value: IPlayQueueTableRowStore[]): void {
		this.items = value;
	}

	@action.bound clear(): void {
		this.currentIndex = undefined;
		this.items = [];
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

	@action.bound setCurrentItem(
		item: IPlayQueueTableRowStore | undefined,
	): void {
		this.currentId = item?.id;
	}

	@action.bound setNextItems(items: IPlayQueueTableRowStore[]): void {
		if (this.currentIndex === undefined) {
			return;
		}

		this.items.splice(this.currentIndex + 1, 0, ...items);
	}

	@action.bound clearAndSetItems(items: IPlayQueueTableRowStore[]): void {
		this.clear();

		this.setCurrentItem(items[0]);

		this.setNextItems(items);
	}

	@action.bound async playNext(
		items: IPlayQueueTableRowStore[],
	): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		this.setNextItems(items);
	}

	@action.bound async playSelectedItemsNext(): Promise<void> {
		await this.playNext(
			this.selectedItemsOrAllItems.map((item) => item.clone()),
		);

		this.unselectAll();
	}

	@action.bound async addItems(
		items: IPlayQueueTableRowStore[],
	): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		this.items.push(...items);
	}

	@action.bound async addSelectedItems(): Promise<void> {
		await this.addItems(
			this.selectedItemsOrAllItems.map((item) => item.clone()),
		);

		this.unselectAll();
	}

	@action.bound async playFirst(
		items: IPlayQueueTableRowStore[],
	): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		const { currentIndex } = this;
		if (currentIndex === undefined) {
			return;
		}

		this.items.splice(currentIndex, 0, ...items);
		this.currentIndex = currentIndex;
	}

	@action.bound moveItem(item: IPlayQueueTableRowStore, index: number): void {
		const element = this.items.splice(this.items.indexOf(item), 1)[0];
		this.items.splice(index, 0, element);
	}

	@action.bound async goToFirst(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		this.currentIndex = 0;
	}

	@action.bound async removeItems(
		items: IPlayQueueTableRowStore[],
	): Promise<void> {
		// Note: We need to remove the current (if any) and other (previous and/or next) items separately,
		// so that the current index can be set properly even if the current item was removed.

		// Capture the current item.
		const { currentItem } = this;

		// First, remove items that are not equal to the current one.
		pull(this.items, ...items.filter((item) => item !== currentItem));

		// Capture the current index.
		const { currentIndex, isLastItem } = this;

		// Then, remove the current item if any.
		pull(
			this.items,
			items.find((item) => item === currentItem),
		);

		// If the current item differs from the captured one, then it means that the current item was removed from the play queue.
		if (this.currentItem !== currentItem) {
			if (isLastItem) {
				// Start over the playlist from the beginning.
				await this.goToFirst();
			} else {
				// Set the current index to the captured one.
				this.currentIndex = currentIndex;
			}
		}
	}

	@action.bound async removeSelectedItems(): Promise<void> {
		await this.removeItems(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	@action.bound async removeOtherItems(
		item: IPlayQueueTableRowStore,
	): Promise<void> {
		const itemId = item.id;
		return this.removeItems(
			this.items.filter((item) => item.id !== itemId),
		);
	}

	@action.bound async removeItemsAbove(
		item: IPlayQueueTableRowStore,
	): Promise<void> {
		const itemIndex = this.items.indexOf(item);
		return this.removeItems(
			this.items.filter((_, index) => index < itemIndex),
		);
	}
}
