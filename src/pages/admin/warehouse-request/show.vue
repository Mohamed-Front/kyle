<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { GoogleMap, Marker, Circle } from 'vue3-google-map'
import axios from 'axios'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const warehouseRequest = ref(null)
const activeMediaIndex = ref(0)

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'

// Fetch warehouse request data
const fetchWarehouseRequest = async () => {
  try {
    loading.value = true
    const response = await axios.get(`/api/warehouse-request/${route.params.id}`)
    warehouseRequest.value = response.data.data
    loading.value = false
  } catch (error) {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('warehouseRequest.loadError'),
      life: 3000
    })
  }
}

// Compute circle options for Google Map
const circle = computed(() => {
  if (
    warehouseRequest.value &&
    warehouseRequest.value.lat &&
    warehouseRequest.value.long &&
    warehouseRequest.value.distance
  ) {
    const lat = parseFloat(warehouseRequest.value.lat)
    const lng = parseFloat(warehouseRequest.value.long)
    const radius = Number(warehouseRequest.value.distance)
    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) return null
    return {
      center: { lat, lng },
      radius,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    }
  }
  return null
})

// Handle map click to log coordinates
const handleMapClick = (event) => {
  const clickedLatLng = event.latLng
  const lat = clickedLatLng.lat()
  const lng = clickedLatLng.lng()
  console.log('Clicked coordinates:', lat, lng)
  // If editing is needed, you could update warehouseRequest.value here
  // e.g., warehouseRequest.value.lat = lat; warehouseRequest.value.long = lng;
}

// Map center computed to ensure valid coordinates
const mapCenter = computed(() => {
  if (warehouseRequest.value && warehouseRequest.value.lat && warehouseRequest.value.long) {
    const lat = parseFloat(warehouseRequest.value.lat)
    const lng = parseFloat(warehouseRequest.value.long)
    return isNaN(lat) || isNaN(lng) ? { lat: 0, lng: 0 } : { lat, lng }
  }
  return { lat: 0, lng: 0 }
})

// Get status severity for Tag component
const getStatusSeverity = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'
    default: return 'danger'
  }
}

// Navigate back
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  fetchWarehouseRequest()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-4">
          <Button
            icon="pi pi-arrow-left"
            class="p-button-text p-button-rounded p-button-lg"
            @click="goBack"
            v-tooltip.right="t('back')"
          />
          <h1 class="text-3xl font-bold text-gray-800">{{ t('warehouseRequest.detailsTitle') }}</h1>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <ProgressBar v-if="loading" mode="indeterminate" class="mb-6 rounded-lg" style="height: 6px" />

      <div v-if="!loading && warehouseRequest" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Information Card -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ t('warehouseRequest.information') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.number') }}</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{{ warehouseRequest.number }}</p>
                </div>
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.name') }}</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{{ warehouseRequest.name }}</p>
                </div>
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.email') }}</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{{ warehouseRequest.email }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.status') }}</label>
                  <Tag
                    :value="warehouseRequest.status_description"
                    :severity="getStatusSeverity(warehouseRequest.status_description)"
                    class="mt-1 px-4 py-2 text-sm"
                  />
                </div>
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.latitude') }}</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{{ warehouseRequest.lat }}</p>
                </div>
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.longitude') }}</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{{ warehouseRequest.long }}</p>
                </div>
              </div>
              <div class="col-span-1 md:col-span-2">
                <div class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.address') }}</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{{ warehouseRequest.address }}</p>
                </div>
                <div v-if="warehouseRequest.rejected_message" class="field">
                  <label class="block text-sm font-medium text-gray-700">{{ t('warehouseRequest.rejectionReason') }}</label>
                  <p class="mt-1 text-red-600 bg-red-50 p-3 rounded-md">{{ warehouseRequest.rejected_message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Media Gallery Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 h-full">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ t('warehouseRequest.documents') }}</h2>
            <div v-if="warehouseRequest.media && warehouseRequest.media.length > 0">
              <!-- Main Image Display -->
              <div class="relative rounded-lg overflow-hidden mb-4" style="height: 150px; background-color: #f5f5f5">
                <img
                  :src="warehouseRequest.media[activeMediaIndex].url"
                  :alt="warehouseRequest.media[activeMediaIndex].name"
                  class="w-full h-full object-contain transition-transform duration-300"
                />
              </div>

              <!-- Thumbnail Gallery -->
              <div class="flex gap-3 overflow-x-auto pb-3">
                <div
                  v-for="(media, index) in warehouseRequest.media"
                  :key="media.id"
                  @click="activeMediaIndex = index"
                  class="cursor-pointer rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300"
                  :class="{ 'border-green-500': activeMediaIndex === index, 'border-transparent': activeMediaIndex !== index }"
                  style="width: 100px; height: 100px;"
                >
                  <img
                    :src="media.url"
                    :alt="media.name"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>

              <!-- Image Info -->
              <div class="mt-4">
                <p class="font-semibold text-gray-700">{{ t('warehouseRequest.documentType') }}:</p>
                <p class="text-gray-600 capitalize">{{ warehouseRequest.media[activeMediaIndex].name.replace(/_/g, ' ') }}</p>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-8 text-gray-500">
              <i class="pi pi-image text-5xl mb-3"></i>
              <p>{{ t('warehouseRequest.noDocuments') }}</p>
            </div>
          </div>
        </div>

        <!-- Map Section -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ t('warehouseRequest.location') }}</h2>
            <div class="rounded-lg overflow-hidden" style="height: 300px">
              <GoogleMap
               api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas"
                style="width: 100%; height: 100%"
                :center="mapCenter"
                :zoom="14"
                @click="handleMapClick"
              >
                <Marker
                  :options="{ position: mapCenter }"
                />
                <Circle
                  v-if="circle"
                  :options="circle"
                />
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

.field label + p {
  margin: 0;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: var(--surface-50);
}

.capitalize {
  text-transform: capitalize;
}

/* Custom scrollbar for thumbnails */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Hover effects */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

/* Container max width */
.container {
  max-width: 1200px;
}
</style>
