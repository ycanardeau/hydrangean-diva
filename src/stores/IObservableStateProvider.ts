import { AnnotationsMap } from 'mobx';

export interface IObservableStateProvider {
	makeObservable<
		T extends object,
		AdditionalKeys extends PropertyKey = never,
	>(
		target: T,
		annotations?: AnnotationsMap<T, AdditionalKeys>,
	): T;
}
