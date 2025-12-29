import { ObservableStateProvider } from '@/features/common/stores/ObservableStateProvider';
import { IPlayQueueItemStore } from '@/features/media-player.play-queue/interfaces/IPlayQueueItemStore';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { beforeEach, describe, expect, it } from 'vitest';

let playQueue: PlayQueueStore;
let playQueueItem: IPlayQueueItemStore;

beforeEach(() => {
	playQueue = new PlayQueueStore(new ObservableStateProvider());
	playQueueItem = playQueue.createItem({
		url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
		type: PlayerType.YouTube,
		videoId: 'jUe7dDLGpv8',
		title: '2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
	});
});

describe('constructor', () => {
	it('should construct PlayerStore', () => {
		expect(playQueueItem).toBeDefined();
		expect(playQueueItem.isSelected).toBe(false);
		expect(playQueueItem.url).toBe(
			'https://www.youtube.com/watch?v=jUe7dDLGpv8',
		);
		expect(playQueueItem.type).toBe('YouTube');
		expect(playQueueItem.videoId).toBe('jUe7dDLGpv8');
		expect(playQueueItem.title).toBe(
			'2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
		);
	});
});

describe('unselect', () => {
	it('should unselect item', () => {
		playQueueItem.toggleSelected();

		expect(playQueueItem.isSelected).toBe(true);

		playQueueItem.unselect();

		expect(playQueueItem.isSelected).toBe(false);
	});
});

describe('toggleSelect', () => {
	it('should set isSelected to true when isSelected is false', () => {
		playQueueItem.toggleSelected();

		expect(playQueueItem.isSelected).toBe(true);
	});

	it('should set isSelected to false when isSelected is true', () => {
		playQueueItem.toggleSelected();

		expect(playQueueItem.isSelected).toBe(true);

		playQueueItem.toggleSelected();

		expect(playQueueItem.isSelected).toBe(false);
	});
});
