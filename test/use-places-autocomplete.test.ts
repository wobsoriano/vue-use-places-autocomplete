/**
 * @vitest-environment jsdom
 */

import { ref } from 'vue'
import { describe, expect, it, vitest } from 'vitest'
import { renderComposable } from 'vue-test-composables'
import { usePlacesAutocomplete } from '../src'

const mockFetchingData = () => new Promise(resolve => setTimeout(resolve, 1000))
const mockSuggestionsData = [
  {
    description: 'Manila, Metro Manila, Philippines',
    matched_substrings: [
      {
        length: 6,
        offset: 0,
      },
    ],
    place_id: 'ChIJi8MeVwPKlzMRH8FpEHXV0Wk',
    reference: 'ChIJi8MeVwPKlzMRH8FpEHXV0Wk',
    structured_formatting: {
      main_text: 'Manila',
      main_text_matched_substrings: [
        {
          length: 6,
          offset: 0,
        },
      ],
      secondary_text: 'Metro Manila, Philippines',
    },
    terms: [
      {
        offset: 0,
        value: 'Manila',
      },
      {
        offset: 8,
        value: 'Metro Manila',
      },
      {
        offset: 22,
        value: 'Philippines',
      },
    ],
    types: [
      'locality',
      'political',
      'geocode',
    ],
  },
]

// @ts-expect-error: Vite env
const apiKey = import.meta.env.VITE_PLACES_API_KEY

type Suggestions = google.maps.places.AutocompletePrediction[] | null

describe('usePlacesAutocomplete', () => {
  const getMaps = (type: 'success' | 'fail', data: Suggestions = null): any => ({
    maps: {
      places: {
        AutocompleteService: vitest.fn(() => ({
          getPlacePredictions: (_: any, cb: (dataArg: Suggestions) => void) => {
            setTimeout(() => {
              cb(type === 'success' ? data : null)
            }, 500)
          },
        })),
        AutocompleteSessionToken: vitest.fn(),
      },
    },
  })

  it('should return initial object', () => {
    global.google = getMaps('success')

    const query = ref('')
    const { result } = renderComposable(() => usePlacesAutocomplete(query, {
      apiKey,
    }))

    expect(result.suggestions.value).toEqual([])
    expect(result.loading.value).toEqual(false)
    expect(result.sessionToken.value).toEqual({})
    expect(typeof result.refreshSessionToken).toBe('function')
  })

  it('should return correct suggestions', async () => {
    global.google = getMaps('success', mockSuggestionsData)

    const query = ref('')
    const { result } = renderComposable(() => usePlacesAutocomplete(query, {
      apiKey,
    }))

    query.value = 'manila'
    await mockFetchingData()
    expect(result.suggestions.value).toEqual(mockSuggestionsData)

    query.value = ''
    await mockFetchingData()
    expect(result.suggestions.value).toEqual([])
  })

  it('should throw error when no Places API and apiKey provided', () => {
    console.error = vitest.fn()
    const query = ref('')

    // @ts-expect-error: Internal
    delete global.google.maps.places
    renderComposable(() => usePlacesAutocomplete(query))
    expect(console.error).toHaveBeenCalledTimes(1)

    // @ts-expect-error: Internal
    delete global.google.maps
    renderComposable(() => usePlacesAutocomplete(query))
    expect(console.error).toHaveBeenCalledTimes(2)

    // @ts-expect-error: Internal
    delete global.google
    renderComposable(() => usePlacesAutocomplete(query))
    expect(console.error).toHaveBeenCalledTimes(3)

    expect(console.error).toHaveBeenCalledWith('[v-use-places-autocomplete]: Google maps places script not loaded')
    expect(console.error).toHaveBeenCalledWith('[v-use-places-autocomplete]: Google maps script not loaded')
    expect(console.error).toHaveBeenCalledWith('[v-use-places-autocomplete]: Google script not loaded')
  })
})
