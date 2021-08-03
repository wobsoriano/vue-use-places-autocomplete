import { onMounted, readonly, Ref, ref } from 'vue-demi';
import { debouncedWatch } from '@vueuse/core';
import { Loader } from '@googlemaps/js-api-loader';
import { GooglePlacesAutocompleteOptions, AutocompletionRequest } from './GooglePlacesAutocomplete.types'
import autocompletionRequestBuilder from './helpers/autocompletionRequestBuilder'

export default function usePlacesAutocomplete(query: Ref<string>, {
    apiKey = '',
    apiOptions = {},
    autocompletionRequest = {},
    debounce = 300,
    minLengthAutocomplete = 0,
    onLoadFailed = console.error,
    withSessionToken,
}: GooglePlacesAutocompleteOptions) {
    const placesService = ref<google.maps.places.AutocompleteService | undefined>(undefined);
    const sessionToken = ref<google.maps.places.AutocompleteSessionToken | undefined>(undefined);
    const fetchSuggestions = ref<google.maps.places.AutocompletePrediction[]>([])

    debouncedWatch(query, () => {
        if (!placesService.value) {
            fetchSuggestions.value = [];
            return;
        }

        if (query.value.length < minLengthAutocomplete) {
            fetchSuggestions.value = []
            return;
        }

        const autocompletionReq: AutocompletionRequest = { ...autocompletionRequest };

        placesService.value.getPlacePredictions(
            autocompletionRequestBuilder(
              autocompletionReq,
              query.value,
              withSessionToken && sessionToken.value,
            ), (suggestions) => {
                fetchSuggestions.value = suggestions || [] 
            },
        );
    }, { debounce })

    const initializeService = () => {
        if (!window.google) throw new Error('[v-use-places-autocomplete]: Google script not loaded');
        if (!window.google.maps) throw new Error('[v-use-places-autocomplete]: Google maps script not loaded');
        if (!window.google.maps.places) throw new Error('[v-use-places-autocomplete]: Google maps places script not loaded');
    
        placesService.value = new window.google.maps.places.AutocompleteService();
        sessionToken.value = new google.maps.places.AutocompleteSessionToken();
    }

    onMounted(() => {
        const init = async () => {
          try {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
              await new Loader({ apiKey, ...{ libraries: ['places'], ...apiOptions }}).load();
            }
            initializeService();
          } catch (error) {
            onLoadFailed(error);
          }
        }
    
        if (apiKey) init();
        else initializeService();
    });

    const refreshSessionToken = () => {
      sessionToken.value = new google.maps.places.AutocompleteSessionToken();
    }

    return {
        fetchSuggestions: readonly(fetchSuggestions),
        sessionToken: readonly(sessionToken),
        refreshSessionToken
    }
}