import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import type { StateRestoreEvent } from '@/stores/StateRestoreEvent';
import type { StateSaveEvent } from '@/stores/StateSaveEvent';

export interface IRestoreStateOptions<TState> {
	onStateRestore?: (event: StateRestoreEvent<TState>) => void;
}

export interface IHandleStateChangeOptions<TState> {
	onStateChange?: (event: StateChangeEvent<TState>) => void;
}

export interface ISaveStateOptions<TState> {
	onStateSave?: (event: StateSaveEvent<TState>) => void;
}

export type IStateHandlerOptions<TState> = IRestoreStateOptions<TState> &
	IHandleStateChangeOptions<TState> &
	ISaveStateOptions<TState>;
