<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDashboardStore } from '@/stores/DashboardStore';
import { MapOrder } from '@/types/DashboardTypes';

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const mapContainer = ref<HTMLDivElement>();
const selectedMarker = ref<MapOrder | null>(null);
const hoveredMarker = ref<MapOrder | null>(null);

const filteredOrders = computed(() => dashboardStore.filteredOrders);
const mapSettings = computed(() => dashboardStore.mapSettings);

// SVG World Map (simplified version)
const worldMapSvg = `
<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Simplified world map paths -->
  <path d="M158 206c-1 1-2 2-3 2-1 1-2 1-3 1-1 0-2 0-3-1-1 0-2-1-3-2l-1-1c0-1 0-2 1-3 0-1 1-2 2-3 1-1 2-2 3-2 1-1 2-1 3-1 1 0 2 0 3 1 1 0 2 1 3 2 1 1 2 2 2 3 0 1 0 2-1 3l-1 1z" fill="#e5e7eb"/>
  <!-- Add more simplified continent shapes -->
  <rect x="100" y="150" width="200" height="100" fill="#e5e7eb" rx="10"/>
  <rect x="350" y="120" width="150" height="80" fill="#e5e7eb" rx="8"/>
  <rect x="550" y="140" width="180" height="90" fill="#e5e7eb" rx="12"/>
  <rect x="200" y="280" width="120" height="60" fill="#e5e7eb" rx="6"/>
  <rect x="400" y="300" width="100" height="50" fill="#e5e7eb" rx="5"/>
  <rect x="750" y="180" width="140" height="70" fill="#e5e7eb" rx="8"/>
</svg>
`;

const getMarkerColor = (status: string) => {
  const colors = {
    pending: '#f59e0b',
    'in-progress': '#3b82f6',
    completed: '#10b981',
    cancelled: '#ef4444',
  };
  return colors[status] || '#6b7280';
};

const getMarkerPosition = (order: MapOrder) => {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const x = ((order.lng + 180) / 360) * 1000;
  const y = ((90 - order.lat) / 180) * 500;
  return { x, y };
};

const handleMarkerClick = (order: MapOrder) => {
  selectedMarker.value = selectedMarker.value?.id === order.id ? null : order;
  dashboardStore.selectOrder(selectedMarker.value);
};

const handleMarkerHover = (order: MapOrder | null) => {
  hoveredMarker.value = order;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

onMounted(() => {
  // Initialize map if needed
});
</script>

<template>
  <div class="flex-1 bg-gray-50 relative">
    <div class="h-full p-4">
      <div class="bg-white rounded-lg shadow-sm h-full relative overflow-hidden">
        <!-- Map Container -->
        <div ref="mapContainer" class="w-full h-full relative">
          <!-- SVG World Map -->
          <div class="absolute inset-0" v-html="worldMapSvg"></div>
          
          <!-- Order Markers -->
          <div class="absolute inset-0">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
              :style="{
                left: getMarkerPosition(order).x + 'px',
                top: getMarkerPosition(order).y + 'px',
              }"
              @click="handleMarkerClick(order)"
              @mouseenter="handleMarkerHover(order)"
              @mouseleave="handleMarkerHover(null)"
            >
              <!-- Marker Circle -->
              <div
                class="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                :style="{ backgroundColor: getMarkerColor(order.status) }"
                :class="{
                  'ring-4 ring-blue-200': selectedMarker?.id === order.id,
                  'scale-125': hoveredMarker?.id === order.id
                }"
              ></div>
              
              <!-- Marker Label (if enabled) -->
              <div
                v-if="mapSettings.showLabels"
                class="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap"
                :class="{
                  'opacity-100': hoveredMarker?.id === order.id || selectedMarker?.id === order.id,
                  'opacity-0': hoveredMarker?.id !== order.id && selectedMarker?.id !== order.id
                }"
              >
                {{ order.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details Panel -->
        <div
          v-if="selectedMarker"
          class="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ t('dashboard.map.orderDetails') }}
            </h3>
            <button
              @click="selectedMarker = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <h4 class="text-sm font-medium text-gray-700">{{ t('dashboard.map.title') }}</h4>
              <p class="text-gray-900">{{ selectedMarker.title }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700">{{ t('dashboard.map.customer') }}</h4>
              <p class="text-gray-900">{{ selectedMarker.customerName }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700">{{ t('dashboard.map.orderNumber') }}</h4>
              <p class="text-gray-900">{{ selectedMarker.orderNumber }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700">{{ t('dashboard.map.status') }}</h4>
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :style="{
                  backgroundColor: getMarkerColor(selectedMarker.status) + '20',
                  color: getMarkerColor(selectedMarker.status)
                }"
              >
                {{ t(`orders.status.${selectedMarker.status}`) }}
              </span>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700">{{ t('dashboard.map.totalAmount') }}</h4>
              <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(selectedMarker.totalAmount) }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700">{{ t('dashboard.map.location') }}</h4>
              <p class="text-sm text-gray-600">{{ selectedMarker.lat.toFixed(4) }}, {{ selectedMarker.lng.toFixed(4) }}</p>
            </div>
          </div>
        </div>

        <!-- Map Legend -->
        <div class="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
          <h4 class="text-sm font-medium text-gray-700 mb-2">{{ t('dashboard.map.legend') }}</h4>
          <div class="space-y-1">
            <div
              v-for="status in ['pending', 'in-progress', 'completed', 'cancelled']"
              :key="status"
              class="flex items-center space-x-2"
            >
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: getMarkerColor(status) }"
              ></div>
              <span class="text-xs text-gray-600">{{ t(`orders.status.${status}`) }}</span>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="dashboardStore.loading"
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
        >
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p class="text-sm text-gray-600">{{ t('dashboard.map.loading') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>