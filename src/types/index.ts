import type { LoaderOptions } from '@googlemaps/js-api-loader'

export interface LatLng {
  lat: number
  lng: number
}

export interface AutocompletionRequest {
  bounds?: [LatLng, LatLng]
  componentRestrictions?: { country: string | string[] }
  location?: LatLng
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
