import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { beforeEach, describe, expect, it } from 'vitest';

let playQueue: PlayQueueStore;

let item: IPlayQueueItemStore;
let item2: IPlayQueueItemStore;
let item3: IPlayQueueItemStore;

beforeEach(() => {
	playQueue = new PlayQueueStore();

	[item, item2, item3] = [
		playQueue.createItemFromDto({
			url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
			type: 'YouTube',
			videoId: 'jUe7dDLGpv8',
			title: '2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
		}),
		playQueue.createItemFromDto({
			url: 'https://www.youtube.com/watch?v=bGdtvUQ9OAs',
			type: 'YouTube',
			videoId: 'bGdtvUQ9OAs',
			title: '3rd Album「nostalgic diva」Nejishiki【Trailer】 /3rd Album「nostalgic diva」/ねじ式【クロスフェード】 - YouTube',
		}),
		playQueue.createItemFromDto({
			url: 'https://www.nicovideo.jp/watch/sm23384530',
			type: 'Niconico',
			videoId: 'sm23384530',
			title: '1ｓｔAlbum「The Wind-Up Diva」/ねじ式【クロスフェード】 - ニコニコ動画',
		}),
	];
});

describe('constructor', () => {
	it('should construct PlayQueueStore', () => {
		expect(playQueue.items.length).toBe(0);
		expect(playQueue.currentId).toBeUndefined();
	});
});

describe('isEmpty', () => {
	it('should return true when play queue is empty', () => {
		expect(playQueue.isEmpty).toBe(true);
	});

	it('should return false when play queue is not empty', () => {
		const item = playQueue.createItemFromDto({
			url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
			type: 'YouTube',
			videoId: 'jUe7dDLGpv8',
			title: '2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
		});
		playQueue.setItems([item]);

		expect(playQueue.isEmpty).toBe(false);
	});
});

describe('currentItem', () => {
	it('should return current item', () => {
		expect(playQueue.currentItem).toBeUndefined();

		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.currentItem).toBe(item2);
	});
});

describe('canPlay', () => {
	it('should return false when currentItem is undefined', () => {
		expect(playQueue.currentItem).toBeUndefined();

		expect(playQueue.canPlay).toBe(false);
	});

	it('should return true when currentItem is not undefined', () => {
		expect(playQueue.currentItem).toBeUndefined();

		playQueue.setItems([item]);
		playQueue.setCurrentItem(item);

		expect(playQueue.canPlay).toBe(true);
	});
});

describe('canPause', () => {
	it('should return false when currentItem is undefined', () => {
		expect(playQueue.currentItem).toBeUndefined();

		expect(playQueue.canPause).toBe(false);
	});

	it('should return true when currentItem is not undefined', () => {
		expect(playQueue.currentItem).toBeUndefined();

		playQueue.setItems([item]);
		playQueue.setCurrentItem(item);

		expect(playQueue.canPause).toBe(true);
	});
});

describe('hasMultipleItems', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueue.hasMultipleItems).toBe(false);
	});

	it('should return false when play queue has only one item', () => {
		playQueue.setItems([item]);

		expect(playQueue.items.length).toBe(1);

		expect(playQueue.hasMultipleItems).toBe(false);
	});

	it('should return true when play queue has multiple items', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);

		expect(playQueue.hasMultipleItems).toBe(true);
	});
});

describe('currentIndex', () => {
	it('should return current index', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});

	it('should set current index', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		playQueue.currentIndex = 1;

		expect(playQueue.currentId).toBe(item2.id);
	});
});

describe('hasPreviousItem', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueue.hasPreviousItem).toBe(false);
	});

	it('should return false when play queue has only one item', () => {
		playQueue.setItems([item]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(1);
		expect(playQueue.currentIndex).toBe(0);

		expect(playQueue.hasPreviousItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is first', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		expect(playQueue.hasPreviousItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is not first', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		expect(playQueue.hasPreviousItem).toBe(true);
	});
});

describe('hasNextItem', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueue.hasNextItem).toBe(false);
	});

	it('should return false when play queue has only one item', () => {
		playQueue.setItems([item]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(1);
		expect(playQueue.items).toStrictEqual([item]);
		expect(playQueue.currentIndex).toBe(0);

		expect(playQueue.hasNextItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is last', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		expect(playQueue.hasNextItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is not last', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		expect(playQueue.hasNextItem).toBe(true);
	});
});

describe('isLastItem', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueue.isLastItem).toBe(false);
	});

	it('should return false when currentIndex is not last', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		expect(playQueue.isLastItem).toBe(false);
	});

	it('should return true when currentIndex is last', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		expect(playQueue.isLastItem).toBe(true);
	});
});

describe('selectedItems', () => {
	it('should return selected items', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);

		for (const item of playQueue.items) {
			expect(item.isSelected).toBe(false);
		}

		for (const item of playQueue.items) {
			item.toggleSelected();
		}

		for (const item of playQueue.items) {
			expect(item.isSelected).toBe(true);
		}

		expect(playQueue.selectedItems.length).toBe(2);
		expect(playQueue.selectedItems).toStrictEqual([item, item2]);
	});
});

describe('allItemsSelected', () => {
	it('should return false if some items are not selected', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);

		for (const item of playQueue.items) {
			expect(item.isSelected).toBe(false);
		}

		playQueue.items[0].toggleSelected();

		expect(playQueue.allItemsSelected).toBe(false);
	});

	it('should return true if all items are selected', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);

		for (const item of playQueue.items) {
			expect(item.isSelected).toBe(false);
		}

		for (const item of playQueue.items) {
			item.toggleSelected();
		}

		expect(playQueue.allItemsSelected).toBe(true);
	});
});

describe('selectedItemsOrAllItems', () => {
	it('should return selected items when selected', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);

		playQueue.items[0].toggleSelected();

		expect(playQueue.selectedItemsOrAllItems.length).toBe(1);
		expect(playQueue.selectedItemsOrAllItems).toStrictEqual([item]);
	});

	it('should return all items when not selected', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);

		expect(playQueue.selectedItemsOrAllItems.length).toBe(2);
		expect(playQueue.selectedItemsOrAllItems).toStrictEqual([item, item2]);
	});
});

describe('setItems', () => {
	it('should set items', () => {
		playQueue.setItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
	});
});

describe('clear', () => {
	it('should clear items and set currentIndex to undefined', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		playQueue.clear();

		expect(playQueue.items.length).toBe(0);
		expect(playQueue.currentIndex).toBe(undefined);
	});
});

describe('unselectAll', () => {
	it('should unselect all items', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		for (const item of playQueue.items) {
			item.toggleSelected();
		}

		expect(playQueue.selectedItems.length).toBe(2);
		expect(playQueue.selectedItems).toStrictEqual([item, item2]);
		for (const item of playQueue.items) {
			expect(item.isSelected).toBe(true);
		}

		playQueue.unselectAll();

		expect(playQueue.selectedItems.length).toBe(0);
		expect(playQueue.selectedItems).toStrictEqual([]);
		for (const item of playQueue.items) {
			expect(item.isSelected).toBe(false);
		}
	});
});

describe('setCurrentItem', () => {
	it('should set currentId', () => {
		expect(playQueue.currentId).toBe(undefined);

		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		expect(playQueue.currentId).toBe(item2.id);
	});
});

describe('setNextItems', () => {
	it('should set next items', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		playQueue.setNextItems([item, item2]);

		expect(playQueue.items.length).toBe(4);
		expect(playQueue.items).toStrictEqual([item, item2, item, item2]);
		expect(playQueue.currentIndex).toBe(1);
	});
});

describe('clearAndSetItems', () => {
	it('should clear and set items', () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		playQueue.clearAndSetItems([item2, item]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item2, item]);
		expect(playQueue.currentIndex).toBe(0);
	});
});

describe('playNext', () => {
	it('should set items if play queue is empty', async () => {
		expect(playQueue.isEmpty).toBe(true);

		await playQueue.playNext([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});

	it('should play next if play queue is not empty', async () => {
		expect(playQueue.isEmpty).toBe(true);

		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		await playQueue.playNext([item, item2]);

		expect(playQueue.items.length).toBe(4);
		expect(playQueue.items).toStrictEqual([item, item, item2, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});
});

// TODO: playSelectedItemsNext

describe('addItems', () => {
	it('should set items if play queue is empty', async () => {
		expect(playQueue.isEmpty).toBe(true);

		await playQueue.addItems([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});

	it('should add items if play queue is not empty', async () => {
		expect(playQueue.isEmpty).toBe(true);

		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		await playQueue.addItems([item, item2]);

		expect(playQueue.items.length).toBe(4);
		expect(playQueue.items).toStrictEqual([item, item2, item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});
});

// TODO: addSelectedItems

describe('playFirst', () => {
	it('should set items if play queue is empty', async () => {
		expect(playQueue.isEmpty).toBe(true);

		await playQueue.playFirst([item, item2]);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});

	it('should play first if play queue is not empty', async () => {
		expect(playQueue.isEmpty).toBe(true);

		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		await playQueue.playFirst([item3]);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item3, item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});
});

describe('moveItem', () => {
	it('should move item', () => {
		playQueue.setItems([item, item2, item3]);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item, item2, item3]);

		playQueue.moveItem(item, 2);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item2, item3, item]);
	});
});

describe('removeItems', () => {
	it('should remove items', async () => {
		playQueue.setItems([item, item2, item3]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item, item2, item3]);
		expect(playQueue.currentIndex).toBe(0);
		expect(playQueue.currentItem).toBe(item);

		await playQueue.removeItems([item, item2]);

		expect(playQueue.items.length).toBe(1);
		expect(playQueue.items).toStrictEqual([item3]);
		expect(playQueue.currentIndex).toBe(0);
		expect(playQueue.currentItem).toBe(item3);
	});
});

describe('removeSelectedItems', () => {
	it('should remove selected items', async () => {
		playQueue.setItems([item, item2, item3]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item, item2, item3]);
		expect(playQueue.currentIndex).toBe(0);
		expect(playQueue.currentItem).toBe(item);

		playQueue.items[0].toggleSelected();
		playQueue.items[1].toggleSelected();

		await playQueue.removeSelectedItems();

		expect(playQueue.items.length).toBe(1);
		expect(playQueue.items).toStrictEqual([item3]);
		expect(playQueue.currentIndex).toBe(0);
		expect(playQueue.currentItem).toBe(item3);
	});
});

describe('removeOtherItems', () => {
	it('should remove other items', async () => {
		playQueue.setItems([item, item2, item3]);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item, item2, item3]);

		await playQueue.removeOtherItems(item2);

		expect(playQueue.items.length).toBe(1);
		expect(playQueue.items).toStrictEqual([item2]);
	});
});

describe('removeItemsAbove', () => {
	it('should remove items above', async () => {
		playQueue.setItems([item, item2, item3]);

		expect(playQueue.items.length).toBe(3);
		expect(playQueue.items).toStrictEqual([item, item2, item3]);

		await playQueue.removeItemsAbove(item3);

		expect(playQueue.items.length).toBe(1);
		expect(playQueue.items).toStrictEqual([item3]);
	});
});

describe('previous', () => {
	it('should go to previous item when available', async () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		await playQueue.previous();

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});

	it('should not go to previous item when not available', async () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		await playQueue.previous();

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});
});

describe('next', () => {
	it('should go to next item when available', async () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);

		await playQueue.next();

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);
	});

	it('should not go to next item when not available', async () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		await playQueue.next();

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);
	});
});

describe('goToFirst', () => {
	it('should set currentIndex to 0', async () => {
		playQueue.setItems([item, item2]);
		playQueue.setCurrentItem(item2);

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(1);

		await playQueue.goToFirst();

		expect(playQueue.items.length).toBe(2);
		expect(playQueue.items).toStrictEqual([item, item2]);
		expect(playQueue.currentIndex).toBe(0);
	});
});
