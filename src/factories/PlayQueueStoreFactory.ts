import { PlayQueueItemStoreFactory } from '@/factories/PlayQueueItemStoreFactory';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlayQueueStoreFactory {
	constructor(
		readonly playQueueItemStoreFactory: PlayQueueItemStoreFactory,
	) {}

	create(): PlayQueueStore {
		return makeObservable(
			new PlayQueueStore(this.playQueueItemStoreFactory),
			{
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
			},
		);
	}
}
