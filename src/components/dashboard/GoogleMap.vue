<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "@/stores/DashboardStore";
import { MapOrder } from "@/types/DashboardTypes";
import { useOrderStore } from "@/stores/OrderStore";

const { t } = useI18n();
const dashboardStore = useDashboardStore();
const orderStore = useOrderStore();

const mapContainer = ref<HTMLDivElement>();
const map = ref<google.maps.Map | null>(null);
const markers = ref<google.maps.Marker[]>([]);
const infoWindow = ref<google.maps.InfoWindow | null>(null);

const filteredOrders = computed(() => orderStore.filteredOrders);
const mapSettings = computed(() => dashboardStore.mapSettings);
const statuses = computed(() => orderStore.defaultData.statuses);

// Computed property to safely check Google Maps API availability
const isGoogleMapsApiAvailable = computed(() => {
  return typeof window !== "undefined" && window.google && window.google.maps;
});

const createCustomMarkerIcon = (color: string, isHovered = false) => {
  return {
    path: "M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z",
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#ffffff",
    strokeWeight: 3,
    scale: isHovered ? 0.1 : 0.08, // Increased from 8/10 to 15/18
  };
};

const createInfoWindowContent = (order: MapOrder) => {
  return `
    <div class="p-3 max-w-xs">
      <div class="flex w-full gap-2">
      <a href="/new-edit-order/${
        order.id
      }" class="cursor-pointer font-semibold bg-blue-300 rounded-lg p-2 text-lg ">${
    order.orderNumber
  }</a>
      <a href="/finance-dashboard?order_id=${
        order.id
      }&activeTab=rental" class="flex w-8 cursor-pointer font-semibold bg-purple-400 rounded-lg p-2 text-lg ">
      <svg class="w-6 h-6  fill-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"/></svg></a>
      </div>
      <div class="space-y-2 text-sm mt-4">
        <div>
          <span class="font-medium text-gray-700">${t(
            "dashboard.map.customer"
          )}:</span>
          <span class="text-gray-900">${order.customerName}</span>
        </div>
        <div>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                style="background-color: ${order.statusColor}20; color: ${
    order.statusColor
  }">
            ${order.status || t("dashboard.stats.noStatus")}
          </span>
        </div>
        <div>
          <span class="font-medium text-gray-700">${t(
            "dashboard.map.location"
          )}:</span>
          <span class="text-gray-900">${order.locationAddress}</span>
        </div>
        <div class="text-xs text-gray-500 mt-2">
           ${order.lat.toFixed(4)}, ${order.lng.toFixed(4)}
        </div>
        <div class="text-xs text-gray-500 mt-2">
           ${order.createdAt || t("dashboard.map.noDate")}
        </div>
      </div>
    </div>
  `;
};

const clearMarkers = () => {
  // Close any open info windows first
  if (infoWindow.value) {
    infoWindow.value.close();
  }

  // Remove each marker from the map individually
  for (let i = 0; i < markers.value.length; i++) {
    const marker = markers.value[i];
    if (marker) {
      // Remove all event listeners
      google.maps.event.clearInstanceListeners(marker);

      // Set map to null to remove from map
      marker.setMap(null);

      // Additional cleanup
      marker.setVisible(false);
    }
  }

  // Clear the markers array completely
  markers.value.length = 0;
  markers.value = [];
};

const addMarkersToMap = () => {
  // CRITICAL: Always clear existing markers first
  clearMarkers();

  if (!map.value) {
    return;
  }

  if (filteredOrders.value.length === 0) {
    return;
  }

  // Add markers only for filtered orders
  filteredOrders.value.forEach((order, index) => {
    const marker = new google.maps.Marker({
      position: { lat: order.lat, lng: order.lng },
      map: map.value,
      title: order.title,
      icon: createCustomMarkerIcon(order.statusColor),
      animation: google.maps.Animation.DROP,
    });

    // Add click listener for info window
    marker.addListener("click", () => {
      if (!infoWindow.value) {
        infoWindow.value = new google.maps.InfoWindow();
      }

      infoWindow.value.setContent(createInfoWindowContent(order));
      infoWindow.value.open(map.value, marker);

      // Update selected order in store
      dashboardStore.selectOrder(order);
    });

    // Add hover effects with bigger size
    marker.addListener("mouseover", () => {
      marker.setIcon(createCustomMarkerIcon(order.statusColor, true));
    });

    marker.addListener("mouseout", () => {
      marker.setIcon(createCustomMarkerIcon(order.statusColor, false));
    });

    // Add to markers array
    markers.value.push(marker);
  });

  // Fit map to show all markers if there are any
  if (markers.value.length > 0) {
    const bounds = new google.maps.LatLngBounds();
    markers.value.forEach((marker) => {
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }
    });
    map.value.fitBounds(bounds);

    // Ensure minimum zoom level
    const listener = google.maps.event.addListener(map.value, "idle", () => {
      if (map.value && map.value.getZoom() && map.value.getZoom()! > 15) {
        map.value.setZoom(15);
      }
      google.maps.event.removeListener(listener);
    });
  }
};

const initializeMap = () => {
  if (!mapContainer.value || !isGoogleMapsApiAvailable.value) return;

  map.value = new google.maps.Map(mapContainer.value, {
    zoom: mapSettings.value.zoom,
    center: {
      lat: mapSettings.value.center.lat,
      lng: mapSettings.value.center.lng,
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    // styles: [
    //   {
    //     featureType: "poi",
    //     elementType: "labels",
    //     stylers: [{ visibility: mapSettings.value.showLabels ? "on" : "off" }],
    //   },
    // ],
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    minZoom: 2,
    maxZoom: 18,
    // Restrict panning to prevent showing repeated world maps
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180,
      },
      strictBounds: true,
    },
  });

  // Add zoom change listener to enforce minimum zoom
  map.value.addListener("zoom_changed", () => {
    if (map.value) {
      const currentZoom = map.value.getZoom();
      if (currentZoom !== null && currentZoom < 2) {
        map.value.setZoom(2);
      }
    }
  });

  // Add markers after map is initialized
  nextTick(() => {
    addMarkersToMap();
  });
};

const waitForGoogleMaps = () => {
  if (isGoogleMapsApiAvailable.value) {
    initializeMap();
  } else {
    setTimeout(waitForGoogleMaps, 100);
  }
};

// Watch for filtered orders changes
watch(
  filteredOrders,
  (newOrders, oldOrders) => {
    if (map.value) {
      // Use nextTick to ensure DOM updates are complete
      nextTick(() => {
        addMarkersToMap();
      });
    } else {
      console.log("❌ Map not ready for marker update");
    }
  },
  {
    deep: true,
    immediate: false,
    flush: "post", // Ensure this runs after all other watchers
  }
);

onMounted(() => {
  nextTick(() => {
    waitForGoogleMaps();
  });
});
</script>

<template>
  <div class="flex-1 h-full bg-gray-50 relative">
    <div class="h-full p-4">
      <div
        class="bg-white rounded-lg shadow-sm h-full relative overflow-hidden"
      >
        <!-- Google Map Container -->
        <div ref="mapContainer" class="w-full h-full"></div>

        <!-- Map Legend -->
        <div
          class="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10"
        >
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            {{ t("dashboard.map.legend") }}
          </h4>
          <div class="space-y-1">
            <div
              v-for="status in statuses"
              :key="status.key"
              class="flex items-center space-x-2"
            >
              <div
                class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                :style="{ backgroundColor: status.color }"
              ></div>
              <span class="text-xs text-gray-600">{{ status.value }}</span>
            </div>
          </div>
        </div>

        <!-- Map Controls -->
        <div
          class="absolute top-4 left-4 bg-white rounded-lg shadow-md p-2 z-10"
        >
          <div class="flex flex-col space-y-2">
            <button
              @click="
                dashboardStore.updateMapSettings({
                  zoom: Math.min(18, mapSettings.zoom + 1),
                })
              "
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
              :disabled="mapSettings.zoom >= 18"
              :class="{
                'opacity-50 cursor-not-allowed': mapSettings.zoom >= 18,
              }"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              @click="
                dashboardStore.updateMapSettings({
                  zoom: Math.max(2, mapSettings.zoom - 1),
                })
              "
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
              :disabled="mapSettings.zoom <= 2"
              :class="{
                'opacity-50 cursor-not-allowed': mapSettings.zoom <= 2,
              }"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <button
              @click="
                dashboardStore.updateMapSettings({
                  center: { lat: 20, lng: 0 },
                  zoom: 2,
                })
              "
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Reset View"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="dashboardStore.loading"
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20"
        >
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
            ></div>
            <p class="text-sm text-gray-600">
              {{ t("dashboard.map.loading") }}
            </p>
          </div>
        </div>

        <!-- No Google Maps Warning -->
        <div
          v-if="!isGoogleMapsApiAvailable"
          class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20"
        >
          <div class="text-center p-6">
            <svg
              class="w-12 h-12 text-gray-400 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Google Maps Not Available
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure Google Maps controls are properly styled */
:deep(.gm-style-iw) {
  border-radius: 8px;
}

:deep(.gm-style-iw-d) {
  overflow: hidden !important;
}
</style>
