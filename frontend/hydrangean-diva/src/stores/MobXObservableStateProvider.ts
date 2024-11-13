import { IObservableStateProvider } from '@/stores/IObservableStateProvider';
import { AnnotationsMap, makeObservable } from 'mobx';

export class MobXObservableStateProvider implements IObservableStateProvider {
	makeObservable<
		T extends object,
		AdditionalKeys extends PropertyKey = never,
	>(target: T, annotations?: AnnotationsMap<T, AdditionalKeys>): T {
		return makeObservable(target, annotations);
	}
}
