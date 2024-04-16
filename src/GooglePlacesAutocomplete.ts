import { computed, defineComponent } from 'vue'
import type { LoaderOptions } from '@googlemaps/js-api-loader'
import { type AutocompletionRequest, usePlacesAutocomplete } from '.'

const GooglePlacesAutocomplete = defineComponent({
  name: 'GooglePlacesAutocomplete',
  props: {
    query: {
      type: String,
      default: '',
    },
    apiKey: {
      type: String,
      default: '',
      required: false,
    },
    apiOptions: {
      type: Object as () => Partial<LoaderOptions>,
      default: () => ({}),
      required: false,
    },
    autocompletionRequest: {
      type: Object as () => AutocompletionRequest,
      default: () => ({}),
      required: false,
    },
    debounce: {
      type: Number,
      default: 300,
      required: false,
    },
    minLengthAutocomplete: {
      type: Number,
      default: 0,
      required: false,
    },
    withSessionToken: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['loadFailed'],
  setup(props, { slots, expose, emit }) {
    const { query: _q, ...rest } = props

    const query = computed(() => props.query)

    const { refreshSessionToken, sessionToken, suggestions, loading } = usePlacesAutocomplete(query, {
      ...rest,
      onLoadFailed(error) {
        emit('loadFailed', error)
      },
    })

    expose({
      refreshSessionToken,
      getSessionToken() {
        return sessionToken.value
      },
    })

    return () => slots.default!({ suggestions: suggestions.value, loading: loading.value })
  },
})

export default GooglePlacesAutocomplete
