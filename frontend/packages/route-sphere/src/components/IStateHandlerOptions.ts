import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import type { StateRestoreEvent } from '@/stores/StateRestoreEvent';
import type { StateValidateEvent } from '@/stores/StateValidateEvent';

export interface IRestoreStateOptions<TState> {
	onStateValidate?: (event: StateValidateEvent<TState>) => Promise<void>;
	onStateRestore?: (event: StateRestoreEvent<TState>) => Promise<void>;
}

export interface IHandleStateChangeOptions<TState> {
	onStateChange?: (event: StateChangeEvent<TState>) => Promise<void>;
}

export type IStateHandlerOptions<TState> = IRestoreStateOptions<TState> &
	IHandleStateChangeOptions<TState>;
