import type { StateChangeEvent } from './StateChangeEvent';
import type { StateRestoreEvent } from './StateRestoreEvent';
import type { StateSaveEvent } from './StateSaveEvent';

export interface IStateStore<TState> {
	state: TState;
	validateState(state: unknown): state is TState;
	onStateRestore?(event: StateRestoreEvent<TState>): void;
	onStateChange?(event: StateChangeEvent<TState>): void;
	onStateSave?(event: StateSaveEvent<TState>): void;
}
