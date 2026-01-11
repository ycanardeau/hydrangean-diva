export interface StateChangeEvent<TState> {
	state: TState;
	previousState: TState;
	keys: (keyof TState)[];
	popState: boolean;
}
