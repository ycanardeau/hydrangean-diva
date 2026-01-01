# Nostalgic Diva

React function components for imperatively controlling embedded players (audio, [Dailymotion](https://www.dailymotion.com/), [Niconico](https://www.nicovideo.jp/), [SoundCloud](https://soundcloud.com/), [Twitch](https://www.twitch.tv/), [Vimeo](https://vimeo.com/) and [YouTube](https://www.youtube.com/)) using refs.

This was originally developed in [VocaDB/vocadb#1101](https://github.com/VocaDB/vocadb/pull/1101) as a part of VocaDB.

NOTE: This is an independent fork of VocaDB/nostalgic-diva.

## Installation

`yarn add @aigamo/nostalgic-diva` or `npm i @aigamo/nostalgic-diva`

## Usage

```tsx
import {
	NostalgicDiva,
	NostalgicDivaProvider,
	PlayerOptions,
} from '@aigamo/nostalgic-diva';

// Callbacks
const handleError = useCallback(() => {}, []);
const handlePlay = useCallback(() => {}, []);
const handlePause = useCallback(() => {}, []);
const handleEnded = useCallback(() => {}, []);
const handleTimeUpdate = useCallback(() => {}, []);

// Options
const options = useMemo(
	(): PlayerOptions => ({
		onError: handleError,
		onPlay: handlePlay,
		onPause: handlePause,
		onEnded: handleEnded,
		onTimeUpdate: handleTimeUpdate,
	}),
	[handleError, handlePlay, handlePause, handleEnded, handleTimeUpdate],
);

<NostalgicDivaProvider>
	<NostalgicDiva
		// Supported media types:
		// - "Audio"
		// - "Niconico"
		// - "SoundCloud"
		// - "Vimeo"
		// - "YouTube"
		src="https://www.youtube.com/watch?v=bGdtvUQ9OAs"
		options={options}
	/>
	;
</NostalgicDivaProvider>;
```

```tsx
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';

const diva = useNostalgicDiva();

// Play
await diva.play();

// Pause
await diva.pause();

// Mute
await diva.setMuted(true);

// Unmute
await diva.setMuted(false);

// Seek
await diva.setCurrentTime(seconds);
```

or by using a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)

```ts
import { defineNostalgicDiva } from '@aigamo/nostalgic-diva';

defineNostalgicDiva();
```

```html
<nostalgic-diva
	src="https://www.youtube.com/watch?v=bGdtvUQ9OAs"
	id="nostalgic-diva"
/>
```

```ts
import { NostalgicDivaElement } from '@aigamo/nostalgic-diva';

const diva = document.querySelector<NostalgicDivaElement>('#nostalgic-diva');

// Event listeners
diva.addEventListener('error', (e) => {});
diva.addEventListener('play', (e) => {});
diva.addEventListener('pause', (e) => {});
diva.addEventListener('ended', (e) => {});
diva.addEventListener('timeupdate', (e) => {});

// Play
await diva.play();

// Pause
await diva.pause();

// Mute
await diva.setMuted(true);

// Unmute
await diva.setMuted(false);

// Seek
await diva.setCurrentTime(seconds);
```

## Imperative functions

| Function                                         | Description                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| `loadVideo(id: string): Promise<void>`           | Loads a new video into an existing player.                          |
| `play(): Promise<void>`                          | Plays a video.                                                      |
| `pause(): Promise<void>`                         | Pauses the playback of a video.                                     |
| `setCurrentTime(seconds: number): Promise<void>` | Sets the current playback position in seconds.                      |
| `setVolume(volume: number): Promise<void>`       | Sets the volume level of the player on a scale from 0 to 1.         |
| `setMuted(muted: boolean): Promise<void>`        | Sets the muted state of the player.                                 |
| `getDuration(): Promise<number \| undefined>`    | Gets the duration of the video in seconds.                          |
| `getCurrentTime(): Promise<number \| undefined>` | Gets the current playback position of a video, measured in seconds. |

## Events

| Event                                  | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `onError(event: any): void`            | Fired when the player experiences some sort of error.  |
| `onPlay(): void`                       | Fired when the video plays.                            |
| `onPause(): void`                      | Fired when the video is paused.                        |
| `onEnded(): void`                      | Fired when playback reaches the end of a video.        |
| `onTimeUpdate(event: TimeEvent): void` | Fired when the playback position of the video changes. |

## Lifecycle

1. [PlayerController.attach](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L95)
1. [IPlayerController.loadVideo](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L38)
1. [PlayerOptions.onLoaded](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L30)
1. [IPlayerController.play](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L39)
1. [PlayerOptions.onPlay](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L31)
1. [PlayerOptions.onTimeUpdate](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L34)
1. [IPlayerController.pause](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L40)
1. [PlayerOptions.onPause](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L32)
1. [PlayerOptions.onEnded](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L33)
1. [PlayerController.detach](https://github.com/ycanardeau/nostalgic-diva/blob/f027a7f8b43523d89cf19d37e8450666d800799d/src/controllers/PlayerController.ts#L120)

The `attach` function is called when switching from another player (Audio, Niconico, SoundCloud and YouTube), and the `detach` function is called when switching to another player. After the `detach` function is called, you cannot use any imperative functions like `loadVideo`, `play`, `pause` and etc.

## References

-   [vocadb/VocaDbWeb/Scripts/ViewModels/PVs/](https://github.com/VocaDB/vocadb/tree/5304e764cf423f07b424e94266e415db40d11f28/VocaDbWeb/Scripts/ViewModels/PVs)
-   [React Player](https://github.com/cookpete/react-player)
-   [ニコニコ動画の HTML5 外部プレイヤーを JavaScript で操作する](https://blog.hayu.io/web/create/nicovideo-embed-player-api/)
-   [Widget API - SoundCloud Developers](https://developers.soundcloud.com/docs/api/html5-widget)
-   [Player SDK: Reference - Vimeo Developer](https://developer.vimeo.com/player/sdk/reference)
-   [YouTube Player API Reference for iframe Embeds | YouTube IFrame Player API | Google Developers](https://developers.google.com/youtube/iframe_api_reference)
-   [How to support Reusable State in Effects · Discussion #18 · reactwg/react-18](https://github.com/reactwg/react-18/discussions/18)
-   [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
-   [dailymotion/dailymotion-sdk-js: Dailymotion JavaScript client API](https://github.com/dailymotion/dailymotion-sdk-js)
-   [Video &amp; Clips | Twitch Developers](https://dev.twitch.tv/docs/embed/video-and-clips/)
-   [bitovi/react-to-web-component: Convert react components to native Web Components. Works with Preact too!](https://github.com/bitovi/react-to-web-component)
-   [Using custom elements - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements)
