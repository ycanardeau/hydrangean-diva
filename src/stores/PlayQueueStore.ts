import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

interface PlayQueueItemDto {
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}

export class PlayQueueItem {
	private static nextId = 1;

	readonly id: number;

	constructor(
		readonly type: PlayerType,
		readonly videoId: string,
		readonly title: string,
	) {
		this.id = PlayQueueItem.nextId++;
	}

	static fromDto(dto: PlayQueueItemDto): PlayQueueItem {
		return new PlayQueueItem(dto.type, dto.videoId, dto.title);
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

	@action setCurrentItem(item: PlayQueueItem | undefined): void {
		this.currentId = item?.id;
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
}
