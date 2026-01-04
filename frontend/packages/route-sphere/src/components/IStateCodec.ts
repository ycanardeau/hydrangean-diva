export interface IStateDeserializer /*<TState>*/ {
	deserialize: () => Promise<unknown>;
}

export interface IStateSerializer<TState> {
	serialize: (state: TState) => Promise<unknown>;
}

export type IStateCodec<TState> = IStateSerializer<TState> &
	IStateDeserializer /*<TState>*/;
