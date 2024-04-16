# vue-use-places-autocomplete

📍 Vue composable for Google Maps Places Autocomplete.

## Installation

```bash
npm install vue-use-places-autocomplete
```

## Usage

```html
<!-- Load the library using the script tag -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

```html
<script setup>
import { ref } from 'vue'
import { usePlacesAutocomplete } from 'vue-use-places-autocomplete'

const query = ref('')
const { suggestions } = usePlacesAutocomplete(query, {
  debounce: 500,
  minLengthAutocomplete: 3
})
</script>

<template>
  <input type="text" v-model="query" placeholder="Search a place..." />
  <ul>
    <li v-for="item in suggestions" :key="item.place_id">{{ item.description }}</li>
  </ul>
</template>
```

## API

```js
const {
  suggestions,
  loading,
  sessionToken,
  refreshSessionToken
} = usePlacesAutocomplete(query, options)
```

### Options

| Key | Type | Default | Description |
| :----- | :-------- | :---------- | :---------- |
| `apiKey` | string | `""` | If this parameter is passed, the component will inject the Google Maps JavaScript API using this apiKey. So there's no need to manually add the script tag to your HTML document. |
| `apiOptions` | [object](https://developers.google.com/maps/documentation/javascript/localization) | `{}` | Object to configure the google script to inject. |
| `autocompletionRequest` | [object](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest) | `{}` | Autocompletion request object to add restrictions to the search. |
| `debounce` | number | `300` | The number of milliseconds to delay before making a call to Google Maps API. |
| `minLengthAutocomplete` | number | `0` | Defines a minimum number of characters needed on the input in order to make requests to the Google's API. |
| `onLoadFailed` | function | `console.error` | Function to be called when the injection of the Google Maps JavaScript API fails due to network error. |
| `withSessionToken` | boolean | `false` | If this is set to true, the composable will handle changing the sessionToken on every session. To learn more about how this works refer to [Google Places Session Token docs](https://developers.google.com/maps/documentation/places/web-service/session-tokens). |

### Return object

| Key | Type | Default | Description |
| :----- | :-------- | :---------- | :---------- |
| `suggestions` | [array](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletePrediction) | `[]` | Contains the autocomplete predictions. |
| `loading` | boolean | `false` | Indicates the status of a request is pending or has completed. |
| `sessionToken` | string \| undefined | `undefined` | Current [sessionToken](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service) being used. |
| `refreshSessionToken` | function | - | This function allows you to refresh the sessionToken being used. |

## Utilities

### geocodeByPlaceId

This function allows to get result by a place id using [Google Maps Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding).

```ts
import { geocodeByPlaceId } from 'vue-use-places-autocomplete'

const results = await geocodeByPlaceId('ChIJk6_7UFmdqTMRgFAxl4KEnUQ')
```

### geocodeByAddress

This function allows to get results by an address using [Google Maps Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding).

```ts
import { getGeocode } from 'vue-use-places-autocomplete'

const results = await geocodeByAddress('Manila, Philippines')
```

### geocodeByLatLng

This function allows to get results by it's coordinates (latitude and longitude) using [Google Maps Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding).

```ts
import { geocodeByLatLng } from 'vue-use-places-autocomplete'

const results = await geocodeByLatLng({ lat: 14.5995, lng: -120.9842 })
```

### getLatLng

This functions allows to get the latitude and longitude of a geocoder result.

```ts
import { geocodeByAddress, getLatLng } from 'vue-use-places-autocomplete'

const results = await geocodeByAddress('Manila, Philippines')
const { lat, lng } = await getLatLng(results[0])
```

## Credits

- [react-google-places-autocomplete](https://github.com/tintef/react-google-places-autocomplete) - React component for Google Places Autocomplete.
- [use-places-autocomplete](https://github.com/wellyshen/use-places-autocomplete) - React hook for Google Maps Places Autocomplete.

### License

MIT
