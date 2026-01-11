export interface IStateSetter<TState> {
	set: (state: TState) => void;
}

export interface IStateGetter<TState> {
	get: () => TState;
}

export type IStateAccessor<TState> = IStateSetter<TState> &
	IStateGetter<TState>;
