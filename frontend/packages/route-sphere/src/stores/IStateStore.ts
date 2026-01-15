import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import type { StateRestoreEvent } from '@/stores/StateRestoreEvent';
import type { StateSaveEvent } from '@/stores/StateSaveEvent';

export interface IStateStore<TState> {
	state: TState;
	validateState(state: unknown): state is TState;
	onStateRestore?(event: StateRestoreEvent<TState>): void;
	onStateChange?(event: StateChangeEvent<TState>): void;
	onStateSave?(event: StateSaveEvent<TState>): void;
}
