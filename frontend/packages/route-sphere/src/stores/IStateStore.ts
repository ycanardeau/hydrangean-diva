import type { StateChangeEvent } from './StateChangeEvent';

export interface IStateStore<TState> {
	state: TState;
	validateState(state: unknown): state is TState;
	onStateChange?(event: StateChangeEvent<TState>): void;
}
