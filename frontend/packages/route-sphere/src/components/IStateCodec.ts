export interface IStateDeserializer /*<TState>*/ {
	deserialize: () => unknown;
}

export interface IStateSerializer<TState> {
	serialize: (state: TState) => void;
}

export type IStateCodec<TState> = IStateSerializer<TState> &
	IStateDeserializer /*<TState>*/;
