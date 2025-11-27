<template>
  <div class="flex flex-col lg:flex-row min-h-[70vh] m-auto">
    <!-- Image Section with Overlay -->
    <div class="relative hidden lg:block lg:w-1/2">
      <img
        src="../../../assets/login.png"
        alt="Pharmacy Image"
        class="object-cover w-full h-full"
      >
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="p-8 text-center text-white">
          <h2 class="mb-4 text-3xl font-bold">{{ $t('auth.register_pharmacy') }}</h2>
          <p class="text-xl">{{ $t('auth.pharmacy_description') }}</p>
        </div>
      </div>
    </div>

    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 0">
        <div class="space-y-6">
          <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">{{ $t('auth.basic_information') }}</h3>

          <div>
            <label for="pharmacyName" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.pharmacy_name') }} *
            </label>
            <input
              v-model="form.name"
              id="pharmacyName"
              name="pharmacyName"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.email') }} *
            </label>
            <input
              v-model="form.email"
              id="email"
              name="email"
              type="email"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.phone') }} *
            </label>
            <input
              v-model="form.phone"
              id="phone"
              name="phone"
              type="tel"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.password') }} *
            </label>
            <input
              v-model="form.password"
              id="password"
              name="password"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.confirm_password') }} *
            </label>
            <input
              v-model="form.confirmPassword"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="nextStep"
            :disabled="!isStep1Valid"
            class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('auth.next') }}
          </button>
        </div>
      </div>

      <!-- Step 2: License and Location -->
      <div v-show="currentStep === 1">
        <div class="space-y-6">
          <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">{{ $t('auth.license_information') }}</h3>

          <div>
            <label for="licenseNumber" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.license_number') }}
            </label>
            <input
              v-model="form.licenseNumber"
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.license_image') }}</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('licenseImage')"
                @dragleave="handleDragLeave('licenseImage')"
                @drop.prevent="onImageUpload($event, 'licenseImage')"
                :class="{ 'border-green-500 bg-green-50': isDragging.licenseImage, 'border-gray-300': !isDragging.licenseImage }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'licenseImage')"
                  accept="image/*"
                  class="hidden"
                  id="licenseImage"
                />

                <div v-if="form.licenseImagePreview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.licenseImagePreview"
                      alt="License Image Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('licenseImage')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('licenseImage')"
                          class="p-2 text-gray-700 transition bg-white rounded-full hover:bg-gray-100"
                        >
                          <i class="text-sm pi pi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-center text-gray-500">{{ $t('auth.click_or_drag_to_change_photo') }}</p>
                </div>

                <div v-else class="flex flex-col items-center justify-center p-4">
                  <div class="p-3 mb-2 bg-green-100 rounded-full">
                    <i class="text-xl text-green-500 pi pi-image"></i>
                  </div>
                  <p class="mb-1 text-sm text-center text-gray-600">
                    <span class="font-medium text-green-500">{{ $t('auth.click_to_upload') }}</span> {{ $t('auth.or_drag_and_drop') }}
                  </p>
                  <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('auth.location') }}
            </label>
            <div class="mt-1 space-y-4">
              <GoogleMap
                api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas"
                @click="handleMapClick"
                style="width: 100%; height: 250px"
                :center="{ lat: parseFloat(form.location.latitude), lng: parseFloat(form.location.longitude) }"
                :zoom="14"
              >
                <Marker
                  :options="{ position: { lat: parseFloat(form.location.latitude), lng: parseFloat(form.location.longitude) } }"
                />
                <Circle :options="circle" />
              </GoogleMap>

              <div class="flex hidden space-x-4">
                <div class="w-1/2">
                  <label for="latitude" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.latitude') }} *
                  </label>
                  <input
                    v-model="form.location.latitude"
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    required
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    :class="{ 'p-invalid': submitted && !form.location.latitude }"
                  />
                  <small class="text-red-600 p-invalid" v-if="submitted && !form.location.latitude">
                    {{ $t('auth.latitude_required') }}
                  </small>
                </div>

                <div class="w-1/2">
                  <label for="longitude" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.longitude') }} *
                  </label>
                  <input
                    v-model="form.location.longitude"
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    required
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    :class="{ 'p-invalid': submitted && !form.location.longitude }"
                  />
                  <small class="text-red-600 p-invalid" v-if="submitted && !form.location.longitude">
                    {{ $t('auth.longitude_required') }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="prevStep"
            type="button"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ $t('auth.previous') }}
          </button>
          <button
            @click="nextStep"
            type="button"
            class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ $t('auth.next') }}
          </button>
        </div>
      </div>

      <!-- Step 3: Owner Information -->
      <div v-show="currentStep === 2">
        <div class="space-y-6">
          <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">{{ $t('auth.owner_information') }}</h3>

          <div>
            <label for="ownerName" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.owner_name') }} *
            </label>
            <input
              v-model="form.ownerName"
              id="ownerName"
              name="ownerName"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.national_id') }}</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('nationalId')"
                @dragleave="handleDragLeave('nationalId')"
                @drop.prevent="onImageUpload($event, 'nationalId')"
                :class="{ 'border-green-500 bg-green-50': isDragging.nationalId, 'border-gray-300': !isDragging.nationalId }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'nationalId')"
                  accept="image/*"
                  class="hidden"
                  id="nationalId"
                />

                <div v-if="form.nationalIdPreview" class="w-full p-4">
                  <div class="relative group">
                    <img
                      :src="form.nationalIdPreview"
                      alt="National ID Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('nationalId')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('nationalId')"
                          class="p-2 text-gray-700 transition bg-white rounded-full hover:bg-gray-100"
                        >
                          <i class="text-sm pi pi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-center text-gray-500">{{ $t('auth.click_or_drag_to_change_photo') }}</p>
                </div>

                <div v-else class="flex flex-col items-center justify-center w-full p-4">
                  <div class="w-full p-3 mb-2 bg-green-100 rounded-full">
                    <i class="text-xl text-green-500 pi pi-image"></i>
                  </div>
                  <p class="mb-1 text-sm text-center text-gray-600">
                    <span class="font-medium text-green-500">{{ $t('auth.click_to_upload') }}</span> {{ $t('auth.or_drag_and_drop') }}
                  </p>
                  <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.practice_certificate') }}</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('practiceCertificate')"
                @dragleave="handleDragLeave('practiceCertificate')"
                @drop.prevent="onImageUpload($event, 'practiceCertificate')"
                :class="{ 'border-green-500 bg-green-50': isDragging.practiceCertificate, 'border-gray-300': !isDragging.practiceCertificate }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'practiceCertificate')"
                  accept="image/*"
                  class="hidden"
                  id="practiceCertificate"
                />

                <div v-if="form.practiceCertificatePreview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.practiceCertificatePreview"
                      alt="Practice Certificate Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('practiceCertificate')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('practiceCertificate')"
                          class="p-2 text-gray-700 transition bg-white rounded-full hover:bg-gray-100"
                        >
                          <i class="text-sm pi pi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-center text-gray-500">{{ $t('auth.click_or_drag_to_change_photo') }}</p>
                </div>

                <div v-else class="flex flex-col items-center justify-center p-4">
                  <div class="p-3 mb-2 bg-green-100 rounded-full">
                    <i class="text-xl text-green-500 pi pi-image"></i>
                  </div>
                  <p class="mb-1 text-sm text-center text-gray-600">
                    <span class="font-medium text-green-500">{{ $t('auth.click_to_upload') }}</span> {{ $t('auth.or_drag_and_drop') }}
                  </p>
                  <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.pharmacy_logo') }}</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('logo')"
                @dragleave="handleDragLeave('logo')"
                @drop.prevent="onImageUpload($event, 'logo')"
                :class="{ 'border-green-500 bg-green-50': isDragging.logo, 'border-gray-300': !isDragging.logo }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'logo')"
                  accept="image/*"
                  class="hidden"
                  id="logo"
                />

                <div v-if="form.logoPreview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.logoPreview"
                      alt="Pharmacy Logo Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('logo')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('logo')"
                          class="p-2 text-gray-700 transition bg-white rounded-full hover:bg-gray-100"
                        >
                          <i class="text-sm pi pi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-center text-gray-500">{{ $t('auth.click_or_drag_to_change_photo') }}</p>
                </div>

                <div v-else class="flex flex-col items-center justify-center p-4">
                  <div class="p-3 mb-2 bg-green-100 rounded-full">
                    <i class="text-xl text-green-500 pi pi-image"></i>
                  </div>
                  <p class="mb-1 text-sm text-center text-gray-600">
                    <span class="font-medium text-green-500">{{ $t('auth.click_to_upload') }}</span> {{ $t('auth.or_drag_and_drop') }}
                  </p>
                  <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button
            @click="prevStep"
            type="button"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ $t('auth.previous') }}
          </button>
          <button
            @click="submitForm"
            :disabled="!isStep3Valid"
            type="button"
            class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('auth.create_account') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GoogleMap, Marker, Circle } from 'vue3-google-map'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

// Form steps
const steps = [
  { name: t('auth.basic_info_step') },
  { name: t('auth.license_step') },
  { name: t('auth.owner_info_step') }
]

const currentStep = ref(0)
const submitted = ref(false)
const isDragging = ref({
  licenseImage: false,
  nationalId: false,
  practiceCertificate: false,
  logo: false
})

// Form data
const form = ref({
  // Step 1
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',

  // Step 2
  licenseNumber: '',
  licenseImage: null as File | null,
  licenseImageName: '',
  licenseImagePreview: null as string | null,
  location: {
    name: '',
    latitude: '31.984983325941823',
    longitude: '35.900908045672196',
    distance: '1000'
  },

  // Step 3
  ownerName: '',
  nationalId: null as File | null,
  nationalIdName: '',
  nationalIdPreview: null as string | null,
  practiceCertificate: null as File | null,
  practiceCertificateName: '',
  practiceCertificatePreview: null as string | null,
  logo: null as File | null,
  logoName: '',
  logoPreview: null as string | null
})

// Computed circle options for Google Map
const circle = computed(() => {
  return {
    center: { lat: parseFloat(form.value.location.latitude), lng: parseFloat(form.value.location.longitude) },
    radius: parseInt(form.value.location.distance),
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  }
})

// Validation
const isStep1Valid = computed(() => {
  return (
    form.value.name.trim() !== '' &&
    form.value.email.trim() !== '' &&
    form.value.phone.trim() !== '' &&
    form.value.password.trim() !== '' &&
    form.value.password === form.value.confirmPassword
  )
})

const isStep2Valid = computed(() => {
  return (
    form.value.location.latitude !== '' &&
    form.value.location.longitude !== '' &&
    form.value.location.distance !== ''
  )
})

const isStep3Valid = computed(() => {
  return form.value.ownerName.trim() !== ''
})

// Drag and drop handlers
const handleDragOver = (type: 'licenseImage' | 'nationalId' | 'practiceCertificate' | 'logo') => {
  isDragging.value[type] = true
}

const handleDragLeave = (type: 'licenseImage' | 'nationalId' | 'practiceCertificate' | 'logo') => {
  isDragging.value[type] = false
}

const onImageUpload = (event: Event | DragEvent, type: 'licenseImage' | 'nationalId' | 'practiceCertificate' | 'logo') => {
  const file = (event as DragEvent).dataTransfer?.files?.[0] || (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (!file.type.match('image.*')) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('auth.invalid_image_type'),
        life: 3000
      })
      return
    }
    if (file.size > 1024 * 1024) { // 1MB limit
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('auth.image_too_large'),
        life: 3000
      })
      return
    }
    form.value[type] = file
    form.value[`${type}Name`] = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value[`${type}Preview`] = e.target?.result as string
    }
    reader.readAsDataURL(file)
    isDragging.value[type] = false
  }
}

const removeImage = (type: 'licenseImage' | 'nationalId' | 'practiceCertificate' | 'logo') => {
  form.value[type] = null
  form.value[`${type}Name`] = ''
  form.value[`${type}Preview`] = null
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.value = ''
}

const editImage = (type: 'licenseImage' | 'nationalId' | 'practiceCertificate' | 'logo') => {
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.click()
}

// Map click handler
const handleMapClick = (event: any) => {
  const clickedLatLng = event.latLng
  const lat = clickedLatLng.lat()
  const lng = clickedLatLng.lng()
  form.value.location.latitude = lat.toString()
  form.value.location.longitude = lng.toString()
  console.log('Clicked coordinates:', lat, lng)
}

// Navigation between steps
const nextStep = () => {
  if (currentStep.value === 1) {
    submitted.value = true
    if (!isStep2Valid.value) return
  }
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Form submission
const submitForm = async () => {
  submitted.value = true
  if (!isStep3Valid.value) return

  // Prepare form data for submission
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('email', form.value.email)
  formData.append('phone', form.value.phone)
  formData.append('password', form.value.password)
  formData.append('licenseNumber', form.value.licenseNumber)
  if (form.value.licenseImage) formData.append('licenseImage', form.value.licenseImage)
  formData.append('location[name]', form.value.location.name)
  formData.append('location[latitude]', form.value.location.latitude)
  formData.append('location[longitude]', form.value.location.longitude)
  formData.append('location[distance]', form.value.location.distance)
  formData.append('ownerName', form.value.ownerName)
  if (form.value.nationalId) formData.append('nationalId', form.value.nationalId)
  if (form.value.practiceCertificate) formData.append('practiceCertificate', form.value.practiceCertificate)
  if (form.value.logo) formData.append('logo', form.value.logo)

  try {
    await axios.post('/dashboard/pharmacy', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.add({ severity: 'success', summary: t('success'), detail: t('auth.pharmacy_created'), life: 3000 })
    router.push('/dashboard')
  } catch (error: any) {
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('auth.pharmacy_creation_failed'), life: 3000 })
    console.error('Submission error:', error)
  }
}
</script>

<style scoped>
.p-invalid {
  border-color: #e24c4c;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}
</style>
