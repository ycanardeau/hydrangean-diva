import type { StateChangeEvent } from './StateChangeEvent';

export interface IStateStore<TState> {
	state: TState;
	validateState(state: any): state is TState;
	onStateChange?(event: StateChangeEvent<TState>): void;
}
