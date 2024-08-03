import { IPlayQueueStore } from '@/stores/IIPlayQueueStore';
import { IObservableStateProvider } from '@/stores/IObservableStateProvider';
import {
	IPlayQueueItemStore,
	PlayQueueItemDto,
} from '@/stores/IPlayQueueItemStore';
import { getOrAddSchema } from '@/stores/getOrAddSchema';
import { LocalStorageStateStore } from '@aigamo/route-sphere';
import { JSONSchemaType } from 'ajv';
import { pull } from 'lodash-es';
import { action, computed, observable } from 'mobx';

import { PlayQueueItemStore } from './PlayQueueItemStore';

export enum RepeatMode {
	Off = 'Off',
	All = 'All',
	One = 'One',
}

export interface PlayQueueLocalStorageState {
	version?: '1.0';
	repeat?: RepeatMode;
	shuffle?: boolean;
	items?: PlayQueueItemDto[];
	currentIndex?: number;
}

const PlayQueueLocalStorageStateSchema: JSONSchemaType<PlayQueueLocalStorageState> =
	{
		type: 'object',
		properties: {
			version: {
				type: 'string',
				nullable: true,
			},
			repeat: {
				type: 'string',
				enum: Object.values(RepeatMode),
				nullable: true,
			},
			shuffle: {
				type: 'boolean',
				nullable: true,
			},
			items: {
				type: 'array',
				nullable: true,
				items: {
					type: 'object',
					properties: {
						url: {
							type: 'string',
						},
						type: {
							type: 'string',
						},
						videoId: {
							type: 'string',
						},
						title: {
							type: 'string',
						},
					},
					required: ['url', 'type', 'videoId', 'title'],
				},
			},
			currentIndex: {
				type: 'integer',
				nullable: true,
			},
		},
	};

const validatePlayQueueLocalStorageState = getOrAddSchema(
	PlayQueueLocalStorageStateSchema,
	'PlayQueueStore',
);

export class PlayQueueStore
	implements
		IPlayQueueStore,
		LocalStorageStateStore<PlayQueueLocalStorageState>
{
	interacted = false;
	items: IPlayQueueItemStore[] = [];
	currentId: number | undefined;
	repeat = RepeatMode.Off;
	shuffle = false;

	constructor(readonly observableStateProvider: IObservableStateProvider) {
		observableStateProvider.makeObservable(this, {
			interacted: observable,
			items: observable,
			currentId: observable,
			repeat: observable,
			shuffle: observable,
			localStorageState: computed.struct,
			isEmpty: computed,
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
			selectedItemsOrAllItems: computed,
			setItems: action,
			interact: action,
			clear: action.bound,
			unselectAll: action,
			setCurrentItem: action,
			setNextItems: action,
			clearAndSetItems: action,
			playNext: action,
			playSelectedItemsNext: action.bound,
			addItems: action,
			addSelectedItems: action.bound,
			playFirst: action,
			moveItem: action,
			removeItems: action,
			removeSelectedItems: action.bound,
			removeOtherItems: action,
			removeItemsAbove: action,
			toggleRepeat: action.bound,
			toggleShuffle: action.bound,
			previous: action,
			next: action.bound,
			goToFirst: action,
		});
	}

	createItem(dto: PlayQueueItemDto): IPlayQueueItemStore {
		return PlayQueueItemStore.fromDto(
			this.observableStateProvider,
			this,
			dto,
		);
	}

	get localStorageState(): PlayQueueLocalStorageState {
		return {
			version: '1.0',
			repeat: this.repeat,
			shuffle: this.shuffle,
			items: this.items.map((item) => item.dto),
			currentIndex: this.currentIndex,
		};
	}
	set localStorageState(value: PlayQueueLocalStorageState) {
		this.repeat = value.repeat ?? RepeatMode.Off;
		this.shuffle = value.shuffle ?? false;
		this.items = value.items?.map((item) => this.createItem(item)) ?? [];
		this.currentIndex = value.currentIndex;
	}

	validateLocalStorageState(
		localStorageState: any,
	): localStorageState is PlayQueueLocalStorageState {
		return validatePlayQueueLocalStorageState(localStorageState);
	}

	get isEmpty(): boolean {
		return this.items.length === 0;
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
	set allItemsSelected(value: boolean) {
		for (const item of this.items) {
			item.isSelected = value;
		}
	}

	get selectedItemsOrAllItems(): IPlayQueueItemStore[] {
		return this.selectedItems.length > 0 ? this.selectedItems : this.items;
	}

	setItems(value: IPlayQueueItemStore[]): void {
		this.items = value;
	}

	interact(): void {
		this.interacted = true;
	}

	clear(): void {
		this.interact();

		this.currentIndex = undefined;
		this.items = [];
	}

	unselectAll(): void {
		for (const item of this.items) {
			item.unselect();
		}
	}

	setCurrentItem(item: IPlayQueueItemStore | undefined): void {
		this.interact();

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
		this.playNext(this.selectedItemsOrAllItems.map((item) => item.clone()));

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

		this.interact();

		this.items.splice(currentIndex, 0, ...items);
		this.currentIndex = currentIndex;
	}

	moveItem(item: IPlayQueueItemStore, index: number): void {
		const element = this.items.splice(this.items.indexOf(item), 1)[0];
		this.items.splice(index, 0, element);
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
			this.interact();

			if (isLastItem) {
				// Start over the playlist from the beginning.
				this.goToFirst();
			} else {
				// Set the current index to the captured one.
				this.currentIndex = currentIndex;
			}
		}
	}

	async removeSelectedItems(): Promise<void> {
		this.removeItems(this.selectedItemsOrAllItems);

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

		this.interact();

		this.currentIndex--;
	}

	async next(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		if (!this.hasNextItem) {
			return;
		}

		this.interact();

		this.currentIndex++;
	}

	async goToFirst(): Promise<void> {
		if (this.currentIndex === undefined) {
			return;
		}

		this.currentIndex = 0;
	}
}
