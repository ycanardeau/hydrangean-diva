import { PlayerStore } from '@/stores/PlayerStore';
import { action, makeObservable, observable } from 'mobx';

export class PlayerStoreFactory {
	create(): PlayerStore {
		return makeObservable(new PlayerStore(), {
			playing: observable,
			percent: observable,
			seeking: observable,
			setPlaying: action,
			setPercent: action,
			setSeeking: action,
			onPlay: action.bound,
			onPause: action.bound,
			onEnded: action.bound,
			onTimeUpdate: action.bound,
		});
	}
}
