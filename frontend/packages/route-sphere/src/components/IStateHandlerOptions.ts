import type { StateChangeEvent } from '@/stores/StateChangeEvent';

export interface IHandleStateChangeOptions<TState> {
	onStateChange?: (event: StateChangeEvent<TState>) => void;
}

export type IStateHandlerOptions<TState> = IHandleStateChangeOptions<TState>;
