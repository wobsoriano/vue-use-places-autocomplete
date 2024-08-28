import type { LoaderOptions } from '@googlemaps/js-api-loader'

export interface LatLng {
  lat: number
  lng: number
}

export interface LatLngLiteral {
  latDegrees: number
  lngDegrees: number
}

export interface LatLngBoundsLiteral {
  east: number
  north: number
  south: number
  west: number
}

export interface LatLngBounds {
  sw: LatLng | LatLngLiteral | LatLngBounds | LatLngBoundsLiteral
  ne: LatLng | LatLngLiteral
}

export interface AutocompletionRequest {
  bounds?: [LatLng, LatLng]
  componentRestrictions?: { country: string | string[] }
  /**
   * Location for prediction biasing. Predictions will be biased towards the
   * given <code>location</code> and <code>radius</code>. Alternatively,
   * <code>bounds</code> can be used.
   * @deprecated <code>location</code> is deprecated as of May 2023.
   *     Use {@link google.maps.places.AutocompletionRequest.locationBias}
   *     and {@link
   *     google.maps.places.AutocompletionRequest.locationRestriction}
   *     instead.
   */
  location?: LatLng
  locationBias?: LatLng | LatLngLiteral | LatLngBoundsLiteral | string
  locationRestriction?: LatLngBounds | LatLngBoundsLiteral
  offset?: number
  radius?: number
  types?: string[]
}

export interface GooglePlacesAutocompleteOptions {
  apiKey?: string
  apiOptions?: Partial<LoaderOptions>
  autocompletionRequest?: AutocompletionRequest
  debounce?: number
  minLengthAutocomplete?: number
  onLoadFailed?: (error: Error) => void
  withSessionToken?: boolean
}
