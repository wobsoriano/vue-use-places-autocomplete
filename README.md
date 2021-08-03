# v-use-places-autocomplete

📍 Vue composable for Google Maps Places Autocomplete.

## Install

```sh
yarn add v-use-places-autocomplete
```

## Example

```html
<template>
  <input type="text" v-model="query" placeholder="Search a place..." />
  <ul>
    <li v-for="item in fetchSuggestions" :key="item.place_id" v-text="item.description" />
  </ul>
</template>

<script>
import { defineComponent, ref } from 'vue'
import usePlacesAutocomplete from 'v-use-places-autocomplete'

export default defineComponent({
  setup() {
    const query = ref('')
    const { fetchSuggestions } = usePlacesAutocomplete(query, {
      apiKey: 'YOUR_API_KEY',
      minLengthAutocomplete: 2
    })

    return {
      query,
      fetchSuggestions
    }
  }
})
</script>
```