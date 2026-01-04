import type { StateChangeEvent } from './StateChangeEvent';

export interface IReactiveStateStore<TState> {
	state: TState;
	validateState(state: any): state is TState;
	onStateChange?(event: StateChangeEvent<TState>): void;
}
