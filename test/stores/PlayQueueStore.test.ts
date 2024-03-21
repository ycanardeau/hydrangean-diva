import { PlayQueueItemStore } from '@/stores/PlayQueueItemStore';
import { PlayQueueStore, RepeatMode } from '@/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { beforeEach, describe, expect, it } from 'vitest';

let playQueueStore: PlayQueueStore;

let item: PlayQueueItemStore;
let item2: PlayQueueItemStore;
let item3: PlayQueueItemStore;

beforeEach(() => {
	playQueueStore = new PlayQueueStore();

	[item, item2, item3] = [
		PlayQueueItemStore.fromDto({
			url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
			type: PlayerType.YouTube,
			videoId: 'jUe7dDLGpv8',
			title: '2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
		}),
		PlayQueueItemStore.fromDto({
			url: 'https://www.youtube.com/watch?v=bGdtvUQ9OAs',
			type: PlayerType.YouTube,
			videoId: 'bGdtvUQ9OAs',
			title: '3rd Album「nostalgic diva」Nejishiki【Trailer】 /3rd Album「nostalgic diva」/ねじ式【クロスフェード】 - YouTube',
		}),
		PlayQueueItemStore.fromDto({
			url: 'https://www.nicovideo.jp/watch/sm23384530',
			type: PlayerType.Niconico,
			videoId: 'sm23384530',
			title: '1ｓｔAlbum「The Wind-Up Diva」/ねじ式【クロスフェード】 - ニコニコ動画',
		}),
	];
});

describe('constructor', () => {
	it('should construct PlayQueueStore', () => {
		expect(playQueueStore.interacted).toBe(false);
		expect(playQueueStore.items.length).toBe(0);
		expect(playQueueStore.currentId).toBeUndefined();
		expect(playQueueStore.repeat).toBe(RepeatMode.Off);
		expect(playQueueStore.shuffle).toBe(false);
	});
});

describe('isEmpty', () => {
	it('should return true when play queue is empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);
	});

	it('should return false when play queue is not empty', () => {
		const item = PlayQueueItemStore.fromDto({
			url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
			type: PlayerType.YouTube,
			videoId: 'jUe7dDLGpv8',
			title: '2nd Album「Hydrangean Diva」/Nejishiki【Trailer】 - YouTube',
		});
		playQueueStore.setItems([item]);

		expect(playQueueStore.isEmpty).toBe(false);
	});
});

describe('currentItem', () => {
	it('should return current item', () => {
		expect(playQueueStore.currentItem).toBeUndefined();

		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.currentItem).toBe(item2);
	});
});

describe('canPlay', () => {
	it('should return false when currentItem is undefined', () => {
		expect(playQueueStore.currentItem).toBeUndefined();

		expect(playQueueStore.canPlay).toBe(false);
	});

	it('should return true when currentItem is not undefined', () => {
		expect(playQueueStore.currentItem).toBeUndefined();

		playQueueStore.setItems([item]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.canPlay).toBe(true);
	});
});

describe('canPause', () => {
	it('should return false when currentItem is undefined', () => {
		expect(playQueueStore.currentItem).toBeUndefined();

		expect(playQueueStore.canPause).toBe(false);
	});

	it('should return true when currentItem is not undefined', () => {
		expect(playQueueStore.currentItem).toBeUndefined();

		playQueueStore.setItems([item]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.canPause).toBe(true);
	});
});

describe('hasMultipleItems', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueueStore.hasMultipleItems).toBe(false);
	});

	it('should return false when play queue has only one item', () => {
		playQueueStore.setItems([item]);

		expect(playQueueStore.items.length).toBe(1);

		expect(playQueueStore.hasMultipleItems).toBe(false);
	});

	it('should return true when play queue has multiple items', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);

		expect(playQueueStore.hasMultipleItems).toBe(true);
	});
});

describe('currentIndex', () => {
	it('should return current index', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});

	it('should set current index', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		playQueueStore.currentIndex = 1;

		expect(playQueueStore.currentId).toBe(item2.id);
	});
});

describe('hasPreviousItem', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueueStore.hasPreviousItem).toBe(false);
	});

	it('should return false when play queue has only one item', () => {
		playQueueStore.setItems([item]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(1);
		expect(playQueueStore.currentIndex).toBe(0);

		expect(playQueueStore.hasPreviousItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is first', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		expect(playQueueStore.hasPreviousItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is not first', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		expect(playQueueStore.hasPreviousItem).toBe(true);
	});
});

describe('hasNextItem', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueueStore.hasNextItem).toBe(false);
	});

	it('should return false when play queue has only one item', () => {
		playQueueStore.setItems([item]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(1);
		expect(playQueueStore.items).toStrictEqual([item]);
		expect(playQueueStore.currentIndex).toBe(0);

		expect(playQueueStore.hasNextItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is last', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		expect(playQueueStore.hasNextItem).toBe(false);
	});

	it('should return false when play queue has multiple items and currentIndex is not last', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		expect(playQueueStore.hasNextItem).toBe(true);
	});
});

describe('isLastItem', () => {
	it('should return false when play queue is empty', () => {
		expect(playQueueStore.isLastItem).toBe(false);
	});

	it('should return false when currentIndex is not last', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		expect(playQueueStore.isLastItem).toBe(false);
	});

	it('should return true when currentIndex is last', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		expect(playQueueStore.isLastItem).toBe(true);
	});
});

describe('selectedItems', () => {
	it('should return selected items', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);

		for (const item of playQueueStore.items) {
			expect(item.isSelected).toBe(false);
		}

		for (const item of playQueueStore.items) {
			item.toggleSelected();
		}

		for (const item of playQueueStore.items) {
			expect(item.isSelected).toBe(true);
		}

		expect(playQueueStore.selectedItems.length).toBe(2);
		expect(playQueueStore.selectedItems).toStrictEqual([item, item2]);
	});
});

describe('allItemsSelected', () => {
	it('should return false if some items are not selected', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);

		for (const item of playQueueStore.items) {
			expect(item.isSelected).toBe(false);
		}

		playQueueStore.items[0].toggleSelected();

		expect(playQueueStore.allItemsSelected).toBe(false);
	});

	it('should return true if all items are selected', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);

		for (const item of playQueueStore.items) {
			expect(item.isSelected).toBe(false);
		}

		for (const item of playQueueStore.items) {
			item.toggleSelected();
		}

		expect(playQueueStore.allItemsSelected).toBe(true);
	});
});

describe('selectedItemsOrAllItems', () => {
	it('should return selected items when selected', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);

		playQueueStore.items[0].toggleSelected();

		expect(playQueueStore.selectedItemsOrAllItems.length).toBe(1);
		expect(playQueueStore.selectedItemsOrAllItems).toStrictEqual([item]);
	});

	it('should return all items when not selected', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);

		expect(playQueueStore.selectedItemsOrAllItems.length).toBe(2);
		expect(playQueueStore.selectedItemsOrAllItems).toStrictEqual([
			item,
			item2,
		]);
	});
});

describe('setItems', () => {
	it('should set items', () => {
		playQueueStore.setItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
	});
});

describe('interact', () => {
	it('should set interacted to true', () => {
		expect(playQueueStore.interacted).toBe(false);

		(playQueueStore as any).interact();

		expect(playQueueStore.interacted).toBe(true);
	});
});

describe('clear', () => {
	it('should clear items and set currentIndex to undefined', () => {
		expect(playQueueStore.interacted).toBe(false);

		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		playQueueStore.clear();

		expect(playQueueStore.items.length).toBe(0);
		expect(playQueueStore.currentIndex).toBe(undefined);
		expect(playQueueStore.interacted).toBe(true);
	});
});

describe('unselectAll', () => {
	it('should unselect all items', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		for (const item of playQueueStore.items) {
			item.toggleSelected();
		}

		expect(playQueueStore.selectedItems.length).toBe(2);
		expect(playQueueStore.selectedItems).toStrictEqual([item, item2]);
		for (const item of playQueueStore.items) {
			expect(item.isSelected).toBe(true);
		}

		playQueueStore.unselectAll();

		expect(playQueueStore.selectedItems.length).toBe(0);
		expect(playQueueStore.selectedItems).toStrictEqual([]);
		for (const item of playQueueStore.items) {
			expect(item.isSelected).toBe(false);
		}
	});
});

describe('setCurrentItem', () => {
	it('should set currentId', () => {
		expect(playQueueStore.currentId).toBe(undefined);

		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		expect(playQueueStore.currentId).toBe(item2.id);
		expect(playQueueStore.interacted).toBe(true);
	});
});

describe('setNextItems', () => {
	it('should set next items', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		playQueueStore.setNextItems([item, item2]);

		expect(playQueueStore.items.length).toBe(4);
		expect(playQueueStore.items).toStrictEqual([item, item2, item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);
	});
});

describe('clearAndSetItems', () => {
	it('should clear and set items', () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		playQueueStore.clearAndSetItems([item2, item]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item2, item]);
		expect(playQueueStore.currentIndex).toBe(0);
	});
});

describe('playNext', () => {
	it('should set items if play queue is empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);

		playQueueStore.playNext([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});

	it('should play next if play queue is not empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);

		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		playQueueStore.playNext([item, item2]);

		expect(playQueueStore.items.length).toBe(4);
		expect(playQueueStore.items).toStrictEqual([item, item, item2, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});
});

// TODO: playSelectedItemsNext

describe('addItems', () => {
	it('should set items if play queue is empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);

		playQueueStore.addItems([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});

	it('should add items if play queue is not empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);

		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		playQueueStore.addItems([item, item2]);

		expect(playQueueStore.items.length).toBe(4);
		expect(playQueueStore.items).toStrictEqual([item, item2, item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});
});

// TODO: addSelectedItems

describe('playFirst', () => {
	it('should set items if play queue is empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);

		playQueueStore.playFirst([item, item2]);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});

	it('should play first if play queue is not empty', () => {
		expect(playQueueStore.isEmpty).toBe(true);

		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		playQueueStore.playFirst([item3]);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item3, item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
		expect(playQueueStore.interacted).toBe(true);
	});
});

describe('moveItem', () => {
	it('should move item', () => {
		playQueueStore.setItems([item, item2, item3]);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item, item2, item3]);

		playQueueStore.moveItem(item, 2);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item2, item3, item]);
	});
});

describe('removeItems', () => {
	it('should remove items', () => {
		playQueueStore.setItems([item, item2, item3]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item, item2, item3]);
		expect(playQueueStore.currentIndex).toBe(0);
		expect(playQueueStore.currentItem).toBe(item);

		playQueueStore.removeItems([item, item2]);

		expect(playQueueStore.items.length).toBe(1);
		expect(playQueueStore.items).toStrictEqual([item3]);
		expect(playQueueStore.currentIndex).toBe(0);
		expect(playQueueStore.currentItem).toBe(item3);
	});
});

describe('removeSelectedItems', () => {
	it('should remove selected items', () => {
		playQueueStore.setItems([item, item2, item3]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item, item2, item3]);
		expect(playQueueStore.currentIndex).toBe(0);
		expect(playQueueStore.currentItem).toBe(item);

		playQueueStore.items[0].toggleSelected();
		playQueueStore.items[1].toggleSelected();

		playQueueStore.removeSelectedItems();

		expect(playQueueStore.items.length).toBe(1);
		expect(playQueueStore.items).toStrictEqual([item3]);
		expect(playQueueStore.currentIndex).toBe(0);
		expect(playQueueStore.currentItem).toBe(item3);
	});
});

describe('removeOtherItems', () => {
	it('should remove other items', () => {
		playQueueStore.setItems([item, item2, item3]);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item, item2, item3]);

		playQueueStore.removeOtherItems(item2);

		expect(playQueueStore.items.length).toBe(1);
		expect(playQueueStore.items).toStrictEqual([item2]);
	});
});

describe('removeItemsAbove', () => {
	it('should remove items above', () => {
		playQueueStore.setItems([item, item2, item3]);

		expect(playQueueStore.items.length).toBe(3);
		expect(playQueueStore.items).toStrictEqual([item, item2, item3]);

		playQueueStore.removeItemsAbove(item3);

		expect(playQueueStore.items.length).toBe(1);
		expect(playQueueStore.items).toStrictEqual([item3]);
	});
});

describe('toggleRepeat', () => {
	it('should set repeat to RepeatMode.All when repeat is RepeatMode.Off', () => {
		expect(playQueueStore.repeat).toBe(RepeatMode.Off);

		playQueueStore.toggleRepeat();

		expect(playQueueStore.repeat).toBe(RepeatMode.All);
	});

	it('should set repeat to RepeatMode.One when repeat is RepeatMode.All', () => {
		expect(playQueueStore.repeat).toBe(RepeatMode.Off);

		playQueueStore.toggleRepeat();

		expect(playQueueStore.repeat).toBe(RepeatMode.All);

		playQueueStore.toggleRepeat();

		expect(playQueueStore.repeat).toBe(RepeatMode.One);
	});

	it('should set repeat to RepeatMode.Off when repeat is RepeatMode.One', () => {
		expect(playQueueStore.repeat).toBe(RepeatMode.Off);

		playQueueStore.toggleRepeat();

		expect(playQueueStore.repeat).toBe(RepeatMode.All);

		playQueueStore.toggleRepeat();

		expect(playQueueStore.repeat).toBe(RepeatMode.One);

		playQueueStore.toggleRepeat();

		expect(playQueueStore.repeat).toBe(RepeatMode.Off);
	});
});

describe('toggleShuffle', () => {
	it('should set shuffle to true when shuffle is false', () => {
		expect(playQueueStore.shuffle).toBe(false);

		playQueueStore.toggleShuffle();

		expect(playQueueStore.shuffle).toBe(true);
	});

	it('should set shuffle to false when shuffle is true', () => {
		expect(playQueueStore.shuffle).toBe(false);

		playQueueStore.toggleShuffle();

		expect(playQueueStore.shuffle).toBe(true);

		playQueueStore.toggleShuffle();

		expect(playQueueStore.shuffle).toBe(false);
	});
});

describe('previous', () => {
	it('should go to previous item when available', async () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		await playQueueStore.previous();

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});

	it('should not go to previous item when not available', async () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		await playQueueStore.previous();

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});
});

describe('next', () => {
	it('should go to next item when available', async () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);

		await playQueueStore.next();

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);
	});

	it('should not go to next item when not available', async () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		await playQueueStore.next();

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);
	});
});

describe('goToFirst', () => {
	it('should set currentIndex to 0', async () => {
		playQueueStore.setItems([item, item2]);
		playQueueStore.setCurrentItem(item2);

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(1);

		await playQueueStore.goToFirst();

		expect(playQueueStore.items.length).toBe(2);
		expect(playQueueStore.items).toStrictEqual([item, item2]);
		expect(playQueueStore.currentIndex).toBe(0);
	});
});
