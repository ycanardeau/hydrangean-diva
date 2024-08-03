import { IObservableStateProvider } from '@/stores/IObservableStateProvider';
import { AnnotationsMap } from 'mobx';

export class ObservableStateProvider implements IObservableStateProvider {
	makeObservable<
		T extends object,
		AdditionalKeys extends PropertyKey = never,
	>(target: T, annotations?: AnnotationsMap<T, AdditionalKeys>): T {
		return target;
	}
}
