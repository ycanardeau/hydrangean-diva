import { observable } from 'mobx';

import { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';

export class PlaylistListStore {
	items: [] = [];

	constructor(observableStateProvider: IObservableStateProvider) {
		observableStateProvider.makeObservable(this, {
			items: observable,
		});
	}
}
