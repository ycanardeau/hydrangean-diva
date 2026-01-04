import type { StateChangeEvent } from './StateChangeEvent';
import type { StateRestoreEvent } from './StateRestoreEvent';
import type { StateValidateEvent } from './StateValidateEvent';

export interface IStateStore<TState> {
	state: TState;
	validateState(state: unknown): state is TState;
	onStateValidate?(event: StateValidateEvent<TState>): void;
	onStateRestore?(event: StateRestoreEvent<TState>): void;
	onStateChange?(event: StateChangeEvent<TState>): void;
}
