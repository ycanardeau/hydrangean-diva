import { AnnotationsMap } from 'mobx';

import { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';

export class ObservableStateProvider implements IObservableStateProvider {
	makeObservable<
		T extends object,
		AdditionalKeys extends PropertyKey = never,
	>(target: T, annotations?: AnnotationsMap<T, AdditionalKeys>): T {
		return target;
	}
}
