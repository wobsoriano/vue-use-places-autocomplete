import type { Ref } from 'vue'
import { onMounted, reactive, toRefs, watch } from 'vue'
import { debounce as debounceFn } from 'perfect-debounce'
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
  interface State {
    placesService: google.maps.places.AutocompleteService | undefined
    sessionToken: google.maps.places.AutocompleteSessionToken | undefined
    suggestions: google.maps.places.AutocompletePrediction[]
    loading: boolean
  }

  const state = reactive<State>({
    placesService: undefined,
    sessionToken: undefined,
    suggestions: [],
    loading: false,
  })

  const fetchSuggestions = () => {
    if (!state.placesService) {
      state.suggestions = []
      return
    }

    if (query.value.length < minLengthAutocomplete || !query.value.length) {
      state.suggestions = []
      return
    }

    const autocompletionReq: AutocompletionRequest = { ...autocompletionRequest }

    state.loading = true

    state.placesService?.getPlacePredictions(
      autocompletionRequestBuilder(
        autocompletionReq,
        query.value,
        withSessionToken && state.sessionToken,
      ),
      (result) => {
        state.suggestions = result || []
        state.loading = false
      },
    )
  }

  watch(query, debounceFn(fetchSuggestions, debounce))

  const refreshSessionToken = () => {
    state.sessionToken = new google.maps.places.AutocompleteSessionToken()
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

    state.placesService = new window.google.maps.places.AutocompleteService()
    refreshSessionToken()
    fetchSuggestions()
  }

  onMounted(() => {
    const init = async () => {
      try {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          const { Loader } = await import('@googlemaps/js-api-loader')
          const loader = new Loader({ apiKey, ...{ libraries: ['places'], ...apiOptions } })
          await loader.importLibrary('places')
        }

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
    ...toRefs(state),
    refreshSessionToken,
  }
}
