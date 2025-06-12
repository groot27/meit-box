<template>
  <Vue3GoogleAddressAutocomplete
    ref="autocompleteRef"
    v-model="internalAddress"
    :apiKey="apiKey"
    class="input-field"
    @callback="handlePlaceChanged"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import Vue3GoogleAddressAutocomplete from "vue3-google-address-autocomplete";

// Emits
const emit = defineEmits<{
  (
    e: "placeChanged",
    place: google.maps.GeocoderResult | google.maps.places.PlaceResult
  ): void;
}>();
// Refs
const autocompleteRef = ref<InstanceType<
  typeof Vue3GoogleAddressAutocomplete
> | null>(null);

// Get props
const props = defineProps<{
  apiKey: string;
  address?: string | null;
}>();
const internalAddress = ref(props.address ?? "");
// Watch for prop changes to sync

// Emit if user changes the address (optional if needed)
const handlePlaceChanged = (place: google.maps.places.PlaceResult) => {
  internalAddress.value = place.formatted_address ?? "";
  emit("placeChanged", place);
};
</script>
