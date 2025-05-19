import { IPlayQueueItemStore } from '@/features/media-player/stores/IPlayQueueItemStore';
import { ObservableStateProvider } from '@/features/media-player/stores/ObservableStateProvider';
import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { beforeEach, describe, expect, it } from 'vitest';

let playQueueStore: PlayQueueStore;
let playQueueItemStore: IPlayQueueItemStore;

beforeEach(() => {
	playQueueStore = new PlayQueueStore(new ObservableStateProvider());
	playQueueItemStore = playQueueStore.createItem({
		url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
		type: PlayerType.YouTube,
		videoId: 'jUe7dDLGpv8',
		title: '2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
	});
});

describe('constructor', () => {
	it('should construct PlayerStore', () => {
		expect(playQueueItemStore).toBeDefined();
		expect(playQueueItemStore.isSelected).toBe(false);
		expect(playQueueItemStore.url).toBe(
			'https://www.youtube.com/watch?v=jUe7dDLGpv8',
		);
		expect(playQueueItemStore.type).toBe('YouTube');
		expect(playQueueItemStore.videoId).toBe('jUe7dDLGpv8');
		expect(playQueueItemStore.title).toBe(
			'2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
		);
	});
});

describe('unselect', () => {
	it('should unselect item', () => {
		playQueueItemStore.toggleSelected();

		expect(playQueueItemStore.isSelected).toBe(true);

		playQueueItemStore.unselect();

		expect(playQueueItemStore.isSelected).toBe(false);
	});
});

describe('toggleSelect', () => {
	it('should set isSelected to true when isSelected is false', () => {
		playQueueItemStore.toggleSelected();

		expect(playQueueItemStore.isSelected).toBe(true);
	});

	it('should set isSelected to false when isSelected is true', () => {
		playQueueItemStore.toggleSelected();

		expect(playQueueItemStore.isSelected).toBe(true);

		playQueueItemStore.toggleSelected();

		expect(playQueueItemStore.isSelected).toBe(false);
	});
});
