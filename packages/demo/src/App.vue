<template>
  <input type="text" v-model="query" placeholder="Search a place..." />
  <div v-show="loading">Loading...</div>
  <ul>
    <li v-for="item in suggestions" :key="item.place_id" v-text="item.description" />
  </ul>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import usePlacesAutocomplete from 'v-use-places-autocomplete'

const query = ref('')
const { suggestions, loading } = usePlacesAutocomplete(query, {
  apiKey: import.meta.env.VITE_PLACES_API_KEY as string,
  minLengthAutocomplete: 2
})

watchEffect(() => {
  console.log(JSON.parse(JSON.stringify(suggestions.value)))
})
</script>