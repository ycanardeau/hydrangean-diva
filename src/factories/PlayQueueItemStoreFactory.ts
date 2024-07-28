import { PlayQueueItemStore } from '@/stores/PlayQueueItemStore';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlayQueueItemStoreFactory {
	create(
		...props: ConstructorParameters<typeof PlayQueueItemStore>
	): PlayQueueItemStore {
		return makeObservable(new PlayQueueItemStore(...props), {
			isSelected: observable,
			isCurrent: computed,
			index: computed,
			isFirst: computed,
			isLast: computed,
			canMoveToTop: computed,
			canMoveToBottom: computed,
			canRemoveToTop: computed,
			canRemoveOthers: computed,
			unselect: action,
			toggleSelected: action.bound,
			play: action,
			remove: action.bound,
			playFirst: action.bound,
			playNext: action.bound,
			addToPlayQueue: action.bound,
			moveToTop: action.bound,
			moveToBottom: action.bound,
			removeToTop: action.bound,
			removeOthers: action.bound,
		});
	}
}
