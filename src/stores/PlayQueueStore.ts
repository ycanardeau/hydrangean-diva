import { PlayerType } from '@aigamo/nostalgic-diva';
import { pull } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

interface PlayQueueItemDto {
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}

export class PlayQueueItem {
	private static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		readonly type: PlayerType,
		readonly videoId: string,
		readonly title: string,
	) {
		makeObservable(this);

		this.id = PlayQueueItem.nextId++;
	}

	static fromDto(dto: PlayQueueItemDto): PlayQueueItem {
		return new PlayQueueItem(dto.type, dto.videoId, dto.title);
	}

	@action unselect(): void {
		this.isSelected = false;
	}

	@action toggleSelected(): void {
		this.isSelected = !this.isSelected;
	}

	toDto(): PlayQueueItemDto {
		return {
			type: this.type,
			videoId: this.videoId,
			title: this.title,
		};
	}

	clone(): PlayQueueItem {
		return PlayQueueItem.fromDto(this.toDto());
	}
}

export enum RepeatMode {
	Off = 'Off',
	All = 'All',
	One = 'One',
}

export class PlayQueueStore {
	@observable items: PlayQueueItem[] = [];
	@observable currentId?: number;
	@observable repeat = RepeatMode.Off;
	@observable shuffle = false;

	constructor() {
		makeObservable(this);

		// TODO: remove
		this.items = (
			[
				{
					type: 'YouTube',
					videoId: 'bGdtvUQ9OAs',
					title: 'nostalgic diva',
				},
				{
					type: 'Niconico',
					videoId: 'sm26653696',
					title: 'nostalgic diva',
				},
				{
					type: 'Niconico',
					videoId: 'sm23384530',
					title: 'The Wind-Up Diva',
				},
				{
					type: 'YouTube',
					videoId: 'jUe7dDLGpv8',
					title: 'Hydrangean Diva',
				},
				{
					type: 'Niconico',
					videoId: 'sm24890523',
					title: 'Hydrangean Diva',
				},
			] as const
		).map((dto) => PlayQueueItem.fromDto(dto));
	}

	@computed get isEmpty(): boolean {
		return this.items.length === 0;
	}

	@computed get currentItem(): PlayQueueItem | undefined {
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

	@computed get selectedItems(): PlayQueueItem[] {
		return this.items.filter((item) => item.isSelected);
	}

	@computed get allItemsSelected(): boolean {
		return this.selectedItems.length === this.items.length;
	}
	set allItemsSelected(value: boolean) {
		for (const item of this.items) {
			item.isSelected = value;
		}
	}

	@computed get selectedItemsOrAllItems(): PlayQueueItem[] {
		return this.selectedItems.length > 0 ? this.selectedItems : this.items;
	}

	@action clear(): void {
		this.currentIndex = undefined;
		this.items = [];
	}

	@action unselectAll(): void {
		for (const item of this.items) {
			item.unselect();
		}
	}

	@action setCurrentItem(item: PlayQueueItem | undefined): void {
		this.currentId = item?.id;
	}

	@action setNextItems(items: PlayQueueItem[]): void {
		if (this.currentIndex === undefined) {
			return;
		}

		this.items.splice(this.currentIndex + 1, 0, ...items);
	}

	@action clearAndSetItems(items: PlayQueueItem[]): void {
		this.clear();

		this.setCurrentItem(items[0]);

		this.setNextItems(items);
	}

	@action async playNext(items: PlayQueueItem[]): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		this.setNextItems(items);
	}

	@action async playSelectedItemsNext(): Promise<void> {
		this.playNext(this.selectedItemsOrAllItems.map((item) => item.clone()));

		this.unselectAll();
	}

	@action async addItems(items: PlayQueueItem[]): Promise<void> {
		if (this.isEmpty) {
			this.clearAndSetItems(items);
			return;
		}

		this.items.push(...items);
	}

	@action async addSelectedItems(): Promise<void> {
		await this.addItems(
			this.selectedItemsOrAllItems.map((item) => item.clone()),
		);

		this.unselectAll();
	}

	@action async playFirst(items: PlayQueueItem[]): Promise<void> {
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

	@action async removeItems(items: PlayQueueItem[]): Promise<void> {
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
				this.goToFirst();
			} else {
				// Set the current index to the captured one.
				this.currentIndex = currentIndex;
			}
		}
	}

	@action async removeSelectedItems(): Promise<void> {
		this.removeItems(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	@action async removeOtherItems(item: PlayQueueItem): Promise<void> {
		const itemId = item.id;
		return this.removeItems(
			this.items.filter((item) => item.id !== itemId),
		);
	}

	@action async removeItemsAbove(item: PlayQueueItem): Promise<void> {
		const itemIndex = this.items.indexOf(item);
		return this.removeItems(
			this.items.filter((_, index) => index < itemIndex),
		);
	}

	@action toggleRepeat(): void {
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

	@action toggleShuffle(): void {
		this.shuffle = !this.shuffle;
	}

	@action async previous(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		if (!this.hasPreviousItem) {
			return;
		}

		this.currentIndex--;
	}

	@action async next(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		if (!this.hasNextItem) {
			return;
		}

		this.currentIndex++;
	}

	@action async goToFirst(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		this.currentIndex = 0;
	}
}
