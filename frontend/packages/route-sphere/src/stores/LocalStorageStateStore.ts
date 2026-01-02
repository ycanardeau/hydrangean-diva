import type { StateChangeEvent } from '@/stores/StateChangeEvent';

export interface LocalStorageStateStore<TState> {
	localStorageState: TState;
	validateLocalStorageState(
		localStorageState: any,
	): localStorageState is TState;
	onLocalStorageStateChange?(event: StateChangeEvent<TState>): void;
}
