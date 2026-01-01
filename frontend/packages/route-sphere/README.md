# Route Sphere

Sync query parameters with a MobX store and React Router.

This was originally developed in [VocaDB/vocadb#965](https://github.com/VocaDB/vocadb/issues/965) as a part of VocaDB.

NOTE: This is an independent fork of VocaDB/route-sphere.

## Requirements

-   [React](https://github.com/facebook/react)
-   [React Router](https://github.com/remix-run/react-router) (v6)
-   [MobX](https://github.com/mobxjs/mobx)

## Installation

`yarn add @aigamo/route-sphere` or `npm i @aigamo/route-sphere`

## How it works

There are three custom hooks, depending on the use case: `useStoreWithUpdateResults`, `useStoreWithPagination` and `useStoreWithRouteParams`. These hooks are defined as below:

```ts
const useStoreWithUpdateResults = <TRouteParams>(store: StoreWithUpdateResults<TRouteParams>): void;
const useStoreWithPagination = <TRouteParams>(store: StoreWithPagination<TRouteParams>): void;
const useStoreWithRouteParams = <TRouteParams>(store: StoreWithRouteParams<TRouteParams>): void;
```

## useStoreWithUpdateResults hook

The `useStoreWithUpdateResults` updates search results whenever the `routeParams` property changes. The `StoreWithUpdateResult` interface is defined as below:

```ts
interface StoreWithUpdateResults<TRouteParams>
	extends StoreWithRouteParams<TRouteParams> {
	readonly clearResultsByQueryKeys: (keyof TRouteParams)[];
	/** Called when search results should be cleared. */
	onClearResults?: () => void;
	updateResults(clearResults: boolean): Promise<void>;
}
```

The `useStoreWithUpdateResults` hook determines if search results should be cleared by comparing the current and previous values. If that's the case, the `onClearResults` callback is called.

## useStoreWithPagination hook

The `useStoreWithPagination` hook is a helper hook that is composed of the `useStoreWithUpdateResults` and `useStoreWithRouteParams` hooks. The `StoreWithPagination` interface is defined as below:

```ts
interface StoreWithPagination<TRouteParams>
	extends StoreWithUpdateResults<TRouteParams> {
	/** Called when search results should be cleared. */
	onClearResults(): void;
}
```

## useStoreWithRouteParams hook

The `useStoreWithRouteParams` hook updates a store that implements the `StoreWithRouteParams` interface when a route changes, and vice versa. The `StoreWithRouteParams` interface is defined as below:

```ts
interface StoreWithRouteParams<TRouteParams> {
	routeParams: TRouteParams;
	validateRouteParams(data: any): data is TRouteParams;
}
```

The `validateRouteParams` function validates route params and should return `true` if and only if the passed data is valid. Validation happens every time [`location`](https://github.com/ycanardeau/route-sphere/blob/fd53c1324df12e9bbc3c1495136ce97bb9da0377/src/components/useStoreWithRouteParams.tsx#L25) (not URL) changes, which means, when the page is first loaded, when the back/forward buttons on the browser are clicked, and when the page is navigated to a new location programmatically by using the `useNavigate` hook. Note that the `<Link>` component uses the `useNavigate` hook internally.

The `routeParams` property gets and sets the state of the store.

> Reactions should be independent: Does your code rely on some other reaction having to run first? If that is the case, you probably either violated the first rule, or the new reaction you are about to create should be merged into the one it is depending upon. MobX does not guarantee the order in which reactions will be run.

Source: [Running side effects with reactions · MobX](https://mobx.js.org/reactions.html)

## How to generate schema

We use JSON schema to validate route params. Use `typescript-json-schema project/directory/tsconfig.json TYPE` to generate schema from a TypeScript type. For more information, see [YousefED/typescript-json-schema](https://github.com/YousefED/typescript-json-schema).

## References

-   [Feat/163 update URL on search page by ycanardeau · Pull Request #965 · VocaDB/vocadb](https://github.com/VocaDB/vocadb/pull/965)
-   [The complete guide to publishing a React package to npm - LogRocket Blog](https://blog.logrocket.com/the-complete-guide-to-publishing-a-react-package-to-npm/)
-   [How to publish packages to npm (the way the industry does things) | Zell Liew](https://zellwk.com/blog/publish-to-npm/)
