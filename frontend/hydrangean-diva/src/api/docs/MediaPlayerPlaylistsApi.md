# MediaPlayerPlaylistsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**mediaPlayerPlaylistsGet**](MediaPlayerPlaylistsApi.md#mediaplayerplaylistsget) | **GET** /media-player/playlists |  |
| [**mediaPlayerPlaylistsIdDelete**](MediaPlayerPlaylistsApi.md#mediaplayerplaylistsiddelete) | **DELETE** /media-player/playlists/{id} |  |
| [**mediaPlayerPlaylistsIdGet**](MediaPlayerPlaylistsApi.md#mediaplayerplaylistsidget) | **GET** /media-player/playlists/{id} |  |
| [**mediaPlayerPlaylistsPost**](MediaPlayerPlaylistsApi.md#mediaplayerplaylistspost) | **POST** /media-player/playlists |  |



## mediaPlayerPlaylistsGet

> HydrangeanDivaMediaPlayerContractsPlaylistsDtosListPlaylistsResponseDto mediaPlayerPlaylistsGet()



### Example

```ts
import {
  Configuration,
  MediaPlayerPlaylistsApi,
} from '';
import type { MediaPlayerPlaylistsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaPlayerPlaylistsApi();

  try {
    const data = await api.mediaPlayerPlaylistsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**HydrangeanDivaMediaPlayerContractsPlaylistsDtosListPlaylistsResponseDto**](HydrangeanDivaMediaPlayerContractsPlaylistsDtosListPlaylistsResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## mediaPlayerPlaylistsIdDelete

> object mediaPlayerPlaylistsIdDelete(id)



### Example

```ts
import {
  Configuration,
  MediaPlayerPlaylistsApi,
} from '';
import type { MediaPlayerPlaylistsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaPlayerPlaylistsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies MediaPlayerPlaylistsIdDeleteRequest;

  try {
    const data = await api.mediaPlayerPlaylistsIdDelete(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## mediaPlayerPlaylistsIdGet

> HydrangeanDivaMediaPlayerContractsPlaylistsDtosGetPlaylistResponseDto mediaPlayerPlaylistsIdGet(id)



### Example

```ts
import {
  Configuration,
  MediaPlayerPlaylistsApi,
} from '';
import type { MediaPlayerPlaylistsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaPlayerPlaylistsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies MediaPlayerPlaylistsIdGetRequest;

  try {
    const data = await api.mediaPlayerPlaylistsIdGet(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**HydrangeanDivaMediaPlayerContractsPlaylistsDtosGetPlaylistResponseDto**](HydrangeanDivaMediaPlayerContractsPlaylistsDtosGetPlaylistResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


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

