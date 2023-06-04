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

export class PlayQueueStore {
	@observable items: PlayQueueItem[] = [];
	@observable currentId?: number;

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

	@action setCurrentItem(item: PlayQueueItem | undefined): void {
		this.currentId = item?.id;
	}
}
