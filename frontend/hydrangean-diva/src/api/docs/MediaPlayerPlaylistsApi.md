# MediaPlayerPlaylistsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**mediaPlayerPlaylistsPost**](MediaPlayerPlaylistsApi.md#mediaplayerplaylistspost) | **POST** /media-player/playlists |  |



## mediaPlayerPlaylistsPost

> object mediaPlayerPlaylistsPost(hydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest)



### Example

```ts
import {
  Configuration,
  MediaPlayerPlaylistsApi,
} from '';
import type { MediaPlayerPlaylistsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaPlayerPlaylistsApi();

  const body = {
    // HydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest (optional)
    hydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest: ...,
  } satisfies MediaPlayerPlaylistsPostRequest;

  try {
    const data = await api.mediaPlayerPlaylistsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **hydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest** | [HydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest](HydrangeanDivaMediaPlayerEndpointsPlaylistsCreatePlaylistRequest.md) |  | [Optional] |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

