import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { debouncedWatch, get, set } from '@vueuse/core'
import { Loader } from '@googlemaps/js-api-loader'
import type { AutocompletionRequest, GooglePlacesAutocompleteOptions } from './types'
import autocompletionRequestBuilder from './helpers/autocompletionRequestBuilder'

export default function usePlacesAutocomplete(query: Ref<string>, {
  apiKey = '',
  apiOptions = {},
  autocompletionRequest = {},
  debounce = 300,
  minLengthAutocomplete = 0,
  onLoadFailed = console.error,
  withSessionToken,
}: GooglePlacesAutocompleteOptions = {}) {
  const placesService = ref<google.maps.places.AutocompleteService | undefined>(undefined)
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken | undefined>(undefined)
  const suggestions = ref<google.maps.places.AutocompletePrediction[]>([])
  const loading = ref(false)

  const fetchSuggestions = () => {
    if (!get(placesService)) {
      set(suggestions, [])
      return
    }

    if (get(query).length < minLengthAutocomplete || !get(query).length) {
      set(suggestions, [])
      return
    }

    const autocompletionReq: AutocompletionRequest = { ...autocompletionRequest }

    set(loading, true)

    get(placesService)?.getPlacePredictions(
      autocompletionRequestBuilder(
        autocompletionReq,
        get(query),
        withSessionToken && get(sessionToken),
      ), (result) => {
        set(suggestions, result || [])
        set(loading, false)
      },
    )
  }

  debouncedWatch(query, fetchSuggestions, { debounce })

  const refreshSessionToken = () => {
    set(sessionToken, new google.maps.places.AutocompleteSessionToken())
  }

  const initializeService = () => {
    if (!window.google) {
      console.error('[vue-use-places-autocomplete]: Google script not loaded')
      return
    }

    if (!window.google.maps) {
      console.error('[vue-use-places-autocomplete]: Google maps script not loaded')
      return
    }
    if (!window.google.maps.places) {
      console.error('[vue-use-places-autocomplete]: Google maps places script not loaded')
      return
    }

    set(placesService, new window.google.maps.places.AutocompleteService())
    refreshSessionToken()
    fetchSuggestions()
  }

  onMounted(() => {
    const init = async () => {
      try {
        if (!window.google || !window.google.maps || !window.google.maps.places)
          await new Loader({ apiKey, ...{ libraries: ['places'], ...apiOptions } }).load()

        initializeService()
      }
      catch (error: any) {
        onLoadFailed(error)
      }
    }

    if (apiKey)
      init()
    else initializeService()
  })

  return {
    suggestions,
    loading,
    sessionToken,
    refreshSessionToken,
  }
}
