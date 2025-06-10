<template>
  <Vue3GoogleAddressAutocomplete
    ref="autocompleteRef"
    v-model="address"
    :apiKey="apiKey"
    class="input-field"
    @callback="handlePlaceChanged"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Vue3GoogleAddressAutocomplete from "vue3-google-address-autocomplete";

// Emits
const emit = defineEmits<{
  (
    e: "placeChanged",
    place: google.maps.GeocoderResult | google.maps.places.PlaceResult
  ): void;
}>();
const address = ref("");
// Refs
const autocompleteRef = ref<InstanceType<
  typeof Vue3GoogleAddressAutocomplete
> | null>(null);

// Get props
const props = defineProps<{
  apiKey: string;
  address?: string | null;
}>();
onMounted(() => {
  if (props.address) {
    address.value = props.address;
  }
});
// Handle user-selected place
const handlePlaceChanged = (place: google.maps.places.PlaceResult) => {
  emit("placeChanged", place);
};
</script>
