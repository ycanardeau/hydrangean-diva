import type { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import type { AnnotationsMap } from 'mobx';

export class ObservableStateProvider implements IObservableStateProvider {
	makeObservable<
		T extends object,
		AdditionalKeys extends PropertyKey = never,
	>(target: T, _annotations?: AnnotationsMap<T, AdditionalKeys>): T {
		return target;
	}
}
