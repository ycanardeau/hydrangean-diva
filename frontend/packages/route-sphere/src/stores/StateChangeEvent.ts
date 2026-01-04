export interface StateChangeEvent<TState> {
	keys: (keyof TState)[];
	popState: boolean;
}
