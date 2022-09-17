# Route Sphere

Sync query parameters with a MobX store and React Router.

This was originally developed in VocaDB/vocadb#965 as a part of [VocaDB](https://github.com/VocaDB/vocadb).

## Live demo

See [VocaDB's search page](https://vocadb.net/Search?searchType=Song&artistId%5B0%5D=1&artistParticipationStatus=Everything&childTags=false&childVoicebanks=true&draftsOnly=false&filter=&maxLength=0&minLength=0&onlyRatedSongs=false&onlyWithPVs=true&page=1&pageSize=10&songType=Original&sort=RatingScore&unifyEntryTypesAndTags=false&viewMode=Details).

## Requirements

- [React](https://github.com/facebook/react)
- [React Router](https://github.com/remix-run/react-router) (v6)
- [MobX](https://github.com/mobxjs/mobx)

## Installation

`yarn add @vocadb/route-sphere` or `npm i @vocadb/route-sphere`

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
interface StoreWithUpdateResults<TRouteParams> extends StoreWithRouteParams<TRouteParams> {
	readonly clearResultsByQueryKeys: (keyof TRouteParams)[];
	/** Called when search results should be cleared. */
	onClearResults?: () => void;
	updateResults(clearResults: boolean): Promise<void>;
}
```

The `useStoreWithUpdateResults` hook determines if search results should be cleared by comparing the current and previous values. If that's the case, the `onClearResults` callback is called.

#### Examples

- [CommentIndex.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/Comment/CommentIndex.tsx#L142) and [CommentListStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Comment/CommentListStore.ts#L51) ([demo](https://vocadb.net/Comment))
- [SongLyrics.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/Song/SongLyrics.tsx#L30) and [SongLyricsStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Song/SongLyricsStore.ts#L20) ([demo](https://vocadb.net/S/11807/lyrics?lyricsId=3634))
- [SongRankings.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/Song/SongRankings.tsx#L47) and [RankingsStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Song/RankingsStore.ts#L31) ([demo](https://vocadb.net/Song/Rankings))

## useStoreWithPagination hook

The `useStoreWithPagination` hook is a helper hook that is composed of the `useStoreWithUpdateResults` and `useStoreWithRouteParams` hooks. The `StoreWithPagination` interface is defined as below:

```ts
interface StoreWithPagination<TRouteParams> extends StoreWithUpdateResults<TRouteParams> {
	/** Called when search results should be cleared. */
	onClearResults(): void;
}
```

#### Examples

- [ArtistSongs.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/Artist/ArtistSongs.tsx#L32) and [ArtistSongsStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Artist/ArtistSongsStore.ts#L27) ([demo](https://vocadb.net/Ar/30/songs))
- [DiscussionFolders.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/Discussion/DiscussionFolders.tsx#L31) and [DiscussionIndexStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Discussion/DiscussionIndexStore.ts#L33) ([demo](https://vocadb.net/discussion/folders/1))
- [SearchIndex.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/Search/SearchIndex.tsx#L106) and [SearchStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Search/SearchStore.ts#L65) ([demo](https://vocadb.net/Search))
- [SongListDetails.tsx](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Components/SongList/SongListDetails.tsx#L126) and [SongListStore.ts](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/SongList/SongListStore.ts#L77) ([demo](https://vocadb.net/L/20))

## useStoreWithRouteParams hook

The `useStoreWithRouteParams` hook updates a store that implements the `StoreWithRouteParams` interface when a route changes, and vice versa. The `StoreWithRouteParams` interface is defined as below:

```ts
interface StoreWithRouteParams<TRouteParams> {
	/** Whether currently processing popstate. This is to prevent adding the previous state to history. */
	popState: boolean;
	routeParams: TRouteParams;
	validateRouteParams(data: any): data is TRouteParams;
}
```

The `popState` property is set by the `useStoreWithRouteParams` hook to prevent adding the previous state to history.

The `validateRouteParams` function validates route params and should return `true` if and only if the passed data is valid. Validation happens every time [`location`](https://github.com/VocaDB/route-sphere/blob/fd53c1324df12e9bbc3c1495136ce97bb9da0377/src/components/useStoreWithRouteParams.tsx#L25) (not URL) changes, which means, when the page is first loaded, when the back/forward buttons on the browser are clicked, and when the page is navigated to a new location programmatically by using the `useNavigate` hook. Note that the `<Link>` component uses the `useNavigate` hook internally.

The `routeParams` property gets and sets the state of the store.

> Reactions should be independent: Does your code rely on some other reaction having to run first? If that is the case, you probably either violated the first rule, or the new reaction you are about to create should be merged into the one it is depending upon. MobX does not guarantee the order in which reactions will be run.

Source: [Running side effects with reactions · MobX](https://mobx.js.org/reactions.html)

## How to generate schema

We use JSON schema to validate route params. Use `typescript-json-schema project/directory/tsconfig.json TYPE` to generate schema from a TypeScript type. For more information, see [YousefED/typescript-json-schema](https://github.com/YousefED/typescript-json-schema).

#### Examples

- [DiscussionIndexRouteParams.schema.json](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Discussion/DiscussionIndexRouteParams.schema.json) generated from [DiscussionIndexRouteParams](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Discussion/DiscussionIndexStore.ts#L21)
- [ArtistSongsRouteParams.schema.json](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Artist/ArtistSongsRouteParams.schema.json) generated from [ArtistSongsRouteParams](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Artist/ArtistSongsStore.ts#L11)
- [SearchRouteParams.schema.json](https://github.com/VocaDB/vocadb/blob/df9db8a90eee8e5aef9b834993f4643cb85291b7/VocaDbWeb/Scripts/Stores/Search/SearchRouteParams.schema.json) generated from [SearchRouteParams](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/Search/SearchStore.ts#L48)
- [SongListRouteParams.schema.json](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/SongList/SongListRouteParams.schema.json) generated from [SongListRouteParams](https://github.com/VocaDB/vocadb/blob/9dae1c215c3a18327b78254e3fb532656d4c7eca/VocaDbWeb/Scripts/Stores/SongList/SongListStore.ts#L54)

## References

- [Feat/163 update URL on search page by ycanardeau · Pull Request #965 · VocaDB/vocadb](https://github.com/VocaDB/vocadb/pull/965)
- [The complete guide to publishing a React package to npm - LogRocket Blog](https://blog.logrocket.com/the-complete-guide-to-publishing-a-react-package-to-npm/)
- [How to publish packages to npm (the way the industry does things) | Zell Liew](https://zellwk.com/blog/publish-to-npm/)
