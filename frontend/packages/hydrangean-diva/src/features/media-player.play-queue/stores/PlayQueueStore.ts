import type { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import { getOrAddSchema } from '@/features/common/stores/getOrAddSchema';
import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import {
	type PlayQueueDto,
	PlayQueueDtoSchema,
} from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueDto';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { PlayQueueItemStore } from '@/features/media-player.play-queue/stores/PlayQueueItemStore';
import type { LocalStorageStateStore } from '@aigamo/route-sphere';
import { pull } from 'lodash-es';
import { action, computed, observable } from 'mobx';

export class PlayQueueStore
	implements IPlayQueueStore, LocalStorageStateStore<PlayQueueDto>
{
	items: IPlayQueueItemStore[] = [];
	currentId: number | undefined;
	repeat = RepeatMode.Off;
	shuffle = false;

	constructor(readonly observableStateProvider: IObservableStateProvider) {
		observableStateProvider.makeObservable(this, {
			items: observable,
			currentId: observable,
			repeat: observable,
			shuffle: observable,
			localStorageState: computed.struct,
			isEmpty: computed,
			canClear: computed,
			currentItem: computed,
			canPlay: computed,
			canPause: computed,
			hasMultipleItems: computed,
			currentIndex: computed,
			hasPreviousItem: computed,
			hasNextItem: computed,
			isLastItem: computed,
			selectedItems: computed,
			allItemsSelected: computed,
			hasSelectedItems: computed,
			selectedItemsOrAllItems: computed,
			canAddSelectedItems: computed,
			canPlaySelectedItemsNext: computed,
			canRemoveSelectedItems: computed,
			setItems: action,
			clear: action.bound,
			unselectAll: action,
			selectAll: action,
			setCurrentItem: action,
			setNextItems: action,
			clearAndSetItems: action,
			playNext: action,
			playSelectedItemsNext: action.bound,
			addItems: action,
			addSelectedItems: action.bound,
			playFirst: action,
			moveItem: action,
			goToFirst: action,
			removeItems: action,
			removeSelectedItems: action.bound,
			removeOtherItems: action,
			removeItemsAbove: action,
			toggleRepeat: action.bound,
			toggleShuffle: action.bound,
			previous: action,
			next: action.bound,
		});
	}

	createItem(dto: PlayQueueItemDto): IPlayQueueItemStore {
		return PlayQueueItemStore.fromDto(this.observableStateProvider, this, {
			url: dto.url,
			type: dto.type,
			videoId: dto.videoId,
			title: dto.title,
		});
	}

	get localStorageState(): PlayQueueDto {
		return {
			version: '1.0',
			repeat: this.repeat,
			shuffle: this.shuffle,
			items: this.items.map((item) => item.dto),
			currentIndex: this.currentIndex,
		};
	}
	set localStorageState(value: PlayQueueDto) {
		this.repeat = value.repeat ?? RepeatMode.Off;
		this.shuffle = value.shuffle ?? false;
		this.items = value.items?.map((item) => this.createItem(item)) ?? [];
		this.currentIndex = value.currentIndex;
	}

	validateLocalStorageState(
		localStorageState: any,
	): localStorageState is PlayQueueDto {
		return getOrAddSchema(
			PlayQueueDtoSchema,
			'PlayQueueDto',
		)(localStorageState);
	}

	get isEmpty(): boolean {
		return this.items.length === 0;
	}

	get canClear(): boolean {
		return !this.isEmpty;
	}

	get currentItem(): IPlayQueueItemStore | undefined {
		return this.items.find((item) => item.id === this.currentId);
	}

	get canPlay(): boolean {
		return this.currentItem !== undefined;
	}

	get canPause(): boolean {
		return this.currentItem !== undefined;
	}

	get hasMultipleItems(): boolean {
		return this.items.length > 1;
	}

	get currentIndex(): number | undefined {
		return this.currentId !== undefined
			? this.items.findIndex((item) => item.id === this.currentId)
			: undefined;
	}
	set currentIndex(value: number | undefined) {
		this.currentId =
			value !== undefined ? this.items.at(value)?.id : undefined;
	}

	get hasPreviousItem(): boolean {
		return (
			this.hasMultipleItems &&
			this.currentIndex !== undefined &&
			this.currentIndex > 0
		);
	}

	get hasNextItem(): boolean {
		return (
			this.hasMultipleItems &&
			this.currentIndex !== undefined &&
			this.currentIndex < this.items.length - 1
		);
	}

	get isLastItem(): boolean {
		return (
			this.currentIndex !== undefined &&
			this.currentIndex === this.items.length - 1
		);
	}

	get selectedItems(): IPlayQueueItemStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	get allItemsSelected(): boolean {
		return this.selectedItems.length === this.items.length;
	}

	get hasSelectedItems(): boolean {
		return this.selectedItems.length > 0;
	}

	get selectedItemsOrAllItems(): IPlayQueueItemStore[] {
		return this.hasSelectedItems ? this.selectedItems : this.items;
	}

	get canAddSelectedItems(): boolean {
		return !this.isEmpty && this.hasSelectedItems;
	}

	get canPlaySelectedItemsNext(): boolean {
		return !this.isEmpty && this.hasSelectedItems;
	}

	get canRemoveSelectedItems(): boolean {
		return !this.isEmpty && this.hasSelectedItems;
	}

	setItems(value: IPlayQueueItemStore[]): void {
		this.items = value;
	}

	clear(): void {
		this.currentIndex = undefined;
		this.items = [];
	}

	unselectAll(): void {
		for (const item of this.items) {
			item.unselect();
		}
	}

	selectAll(): void {
		for (const item of this.items) {
			item.select();
		}
	}

	setCurrentItem(item: IPlayQueueItemStore | undefined): void {
		this.currentId = item?.id;
	}

	setNextItems(items: IPlayQueueItemStore[]): void {
		if (this.currentIndex === undefined) {
			return;
		}

		this.items.splice(this.currentIndex + 1, 0, ...items);
	}

	clearAndSetItems(items: IPlayQueueItemStore[]): void {
		this.clear();

		this.setCurrentItem(items[0]);

		this.setNextItems(items);
	}

	async playNext(items: IPlayQueueItemStore[]): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		this.setNextItems(items);
	}

	async playSelectedItemsNext(): Promise<void> {
		await this.playNext(
			this.selectedItemsOrAllItems.map((item) => item.clone()),
		);

		this.unselectAll();
	}

	async addItems(items: IPlayQueueItemStore[]): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		this.items.push(...items);
	}

	async addSelectedItems(): Promise<void> {
		await this.addItems(
			this.selectedItemsOrAllItems.map((item) => item.clone()),
		);

		this.unselectAll();
	}

	async playFirst(items: IPlayQueueItemStore[]): Promise<void> {
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

	moveItem(item: IPlayQueueItemStore, index: number): void {
		const element = this.items.splice(this.items.indexOf(item), 1)[0];
		this.items.splice(index, 0, element);
	}

	async goToFirst(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		this.currentIndex = 0;
	}

	async removeItems(items: IPlayQueueItemStore[]): Promise<void> {
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

	async removeSelectedItems(): Promise<void> {
		await this.removeItems(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	async removeOtherItems(item: IPlayQueueItemStore): Promise<void> {
		const itemId = item.id;
		return this.removeItems(
			this.items.filter((item) => item.id !== itemId),
		);
	}

	async removeItemsAbove(item: IPlayQueueItemStore): Promise<void> {
		const itemIndex = this.items.indexOf(item);
		return this.removeItems(
			this.items.filter((_, index) => index < itemIndex),
		);
	}

	toggleRepeat(): void {
		switch (this.repeat) {
			case RepeatMode.Off:
				this.repeat = RepeatMode.All;
				break;
			case RepeatMode.All:
				this.repeat = RepeatMode.One;
				break;
			case RepeatMode.One:
				this.repeat = RepeatMode.Off;
				break;
		}
	}

	toggleShuffle(): void {
		this.shuffle = !this.shuffle;
	}

	async previous(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		if (!this.hasPreviousItem) {
			return;
		}

		this.currentIndex--;
	}

	async next(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		if (!this.hasNextItem) {
			return;
		}

		this.currentIndex++;
	}
}
