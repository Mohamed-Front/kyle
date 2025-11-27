<template>
  <div class="flex flex-col lg:flex-row min-h-[70vh] m-auto">
    <!-- Image Section with Overlay -->
    <div class="relative hidden lg:block lg:w-1/2">
      <img
        src="../../../assets/login.png"
        alt="Warehouse Registration"
        class="object-cover w-full h-full"
      >
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="p-8 text-center text-white">
          <h2 class="mb-4 text-3xl font-bold">{{ $t('auth.register_warehouse') }}</h2>
          <p class="text-xl">{{ $t('auth.warehouse_description') }}</p>
        </div>
      </div>
    </div>

    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 0">
        <div class="space-y-6">
          <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">{{ $t('auth.basic_information') }}</h3>

          <div>
            <label for="warehouseName" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.warehouse_name') }} *
            </label>
            <input
              v-model="form.name"
              id="warehouseName"
              name="name"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              :class="{ 'border-red-500': errors.name }"
            />
            <small class="text-red-600" v-if="errors.name">{{ errors.name }}</small>
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
              :class="{ 'border-red-500': errors.email }"
            />
            <small class="text-red-600" v-if="errors.email">{{ errors.email }}</small>
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
              :class="{ 'border-red-500': errors.phone }"
              @input="validatePhone"
            />
            <small class="text-red-600" v-if="errors.phone">{{ errors.phone }}</small>
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
              :class="{ 'border-red-500': errors.password }"
              @input="validatePassword"
            />
            <small class="text-red-600" v-if="errors.password">{{ errors.password }}</small>
          </div>

          <div>
            <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.confirm_password') }} *
            </label>
            <input
              v-model="form.password_confirmation"
              id="passwordConfirmation"
              name="password_confirmation"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              :class="{ 'border-red-500': errors.password_confirmation }"
              @input="validatePasswordConfirmation"
            />
            <small class="text-red-600" v-if="errors.password_confirmation">{{ errors.password_confirmation }}</small>
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
          <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">{{ $t('auth.warehouse_information') }}</h3>

          <div>
            <label for="licenseNumber" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.license_number') }}
            </label>
            <input
              v-model="form.license_number"
              id="licenseNumber"
              name="license_number"
              type="text"
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.warehouse_license') }}</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('warehouse_license')"
                @dragleave="handleDragLeave('warehouse_license')"
                @drop.prevent="onImageUpload($event, 'warehouse_license')"
                :class="{ 'border-green-500 bg-green-50': isDragging.warehouse_license, 'border-gray-300': !isDragging.warehouse_license }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'warehouse_license')"
                  accept="image/*"
                  class="hidden"
                  id="warehouse_license"
                />
                <div v-if="form.warehouse_license_preview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.warehouse_license_preview"
                      alt="Warehouse License Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('warehouse_license')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('warehouse_license')"
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
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.address') }}</label>
            <input
              v-model="form.address"
              id="address"
              name="address"
              type="text"
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              :class="{ 'border-red-500': errors.address }"
            />
            <small class="text-red-600" v-if="errors.address">{{ errors.address }}</small>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.location') }}</label>
            <div class="mt-1 space-y-4">
              <GoogleMap
                  api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas"
                @click="handleMapClick"
                style="width: 100%; height: 250px"
                :center="{ lat: parseFloat(form.lat), lng: parseFloat(form.long) }"
                :zoom="14"
              >
                <Marker
                  :options="{ position: { lat: parseFloat(form.lat), lng: parseFloat(form.long) } }"
                />
              </GoogleMap>
              <div class="flex space-x-4 hidden">
                <div class="w-1/2 mx-2">
                  <label for="latitude" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.latitude') }} *
                  </label>
                  <input
                    v-model="form.lat"
                    id="latitude"
                    name="lat"
                    type="number"
                    step="any"
                    required
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    :class="{ 'border-red-500': errors.lat }"
                  />
                  <small class="text-red-600" v-if="errors.lat">{{ errors.lat }}</small>
                </div>
                <div class="w-1/2">
                  <label for="longitude" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.longitude') }} *
                  </label>
                  <input
                    v-model="form.long"
                    id="longitude"
                    name="long"
                    type="number"
                    step="any"
                    required
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    :class="{ 'border-red-500': errors.long }"
                  />
                  <small class="text-red-600" v-if="errors.long">{{ errors.long }}</small>
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
            :disabled="!isStep2Valid"
            class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              v-model="form.owner_name"
              id="ownerName"
              name="owner_name"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              :class="{ 'border-red-500': errors.owner_name }"
            />
            <small class="text-red-600" v-if="errors.owner_name">{{ errors.owner_name }}</small>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.national_id') }}</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('national_id')"
                @dragleave="handleDragLeave('national_id')"
                @drop.prevent="onImageUpload($event, 'national_id')"
                :class="{ 'border-green-500 bg-green-50': isDragging.national_id, 'border-gray-300': !isDragging.national_id }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'national_id')"
                  accept="image/*"
                  class="hidden"
                  id="national_id"
                />
                <div v-if="form.national_id_preview" class="w-full p-4">
                  <div class="relative group">
                    <img
                      :src="form.national_id_preview"
                      alt="National ID Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('national_id')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('national_id')"
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
            <label class="block text-sm font-medium text-gray-700">{{ $t('auth.warehouse_logo') }} *</label>
            <div class="flex justify-start">
              <label
                @dragover.prevent="handleDragOver('warehouse_logo')"
                @dragleave="handleDragLeave('warehouse_logo')"
                @drop.prevent="onImageUpload($event, 'warehouse_logo')"
                :class="{ 'border-green-500 bg-green-50': isDragging.warehouse_logo, 'border-gray-300': !isDragging.warehouse_logo }"
                class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'warehouse_logo')"
                  accept="image/*"
                  class="hidden"
                  id="warehouse_logo"
                  required
                />
                <div v-if="form.warehouse_logo_preview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.warehouse_logo_preview"
                      alt="Warehouse Logo Preview"
                      class="object-cover w-full h-32 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
                    >
                    <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                      <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                          type="button"
                          @click.stop="removeImage('warehouse_logo')"
                          class="p-2 text-white transition bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('warehouse_logo')"
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
            <small class="text-red-600" v-if="errors.warehouse_logo">{{ errors.warehouse_logo }}</small>
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

      <!-- Success Step -->
      <div v-show="currentStep === 3" class="text-center">
        <div class="p-6 rounded-lg bg-green-50">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <i class="text-3xl text-green-500 pi pi-check"></i>
          </div>
          <h3 class="mb-2 text-xl font-bold text-green-800">{{ $t('auth.request_submitted') }}</h3>
          <p class="mb-6 text-gray-600">{{ $t('auth.request_submitted_description') }}</p>

          <div class="p-4 mb-6 bg-white border rounded-lg shadow-sm border-green-200">
            <div class="text-sm font-medium text-gray-500">{{ $t('auth.request_number') }}</div>
            <div class="mt-1 text-2xl font-bold text-green-600">{{ requestData.number }}</div>
          </div>

          <p class="mb-6 text-sm text-gray-500">{{ $t('auth.request_submitted_note') }}</p>

          <button
            @click="resetForm"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ $t('auth.back_to_home') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { GoogleMap, Marker } from 'vue3-google-map'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

// Form steps
const steps = [
  { name: t('auth.basic_info_step') },
  { name: t('auth.warehouse_info_step') },
  { name: t('auth.owner_info_step') }
]

const currentStep = ref(0)
const submitted = ref(false)
const isDragging = ref({
  warehouse_license: false,
  national_id: false,
  warehouse_logo: false
})

// Request data after successful submission
const requestData = reactive({
  number: '',
  name: '',
  email: '',
  createdAt: ''
})

// Form data
const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  license_number: '',
  address: '',
  lat: '34.252168898111194',
  long: '38.94713447269957',
  owner_name: '',
  warehouse_license: null as File | null,
  warehouse_license_name: '',
  warehouse_license_preview: null as string | null,
  national_id: null as File | null,
  national_id_name: '',
  national_id_preview: null as string | null,
  warehouse_logo: null as File | null,
  warehouse_logo_name: '',
  warehouse_logo_preview: null as string | null
})

// Error messages
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  address: '',
  lat: '',
  long: '',
  owner_name: '',
  warehouse_logo: ''
})

// Validation functions
const validatePhone = () => {
  if (!form.phone.trim()) {
    errors.phone = t('auth.phone_required')
  } else if (form.phone.length > 15) {
    errors.phone = t('auth.phone_too_long')
  } else {
    errors.phone = ''
  }
}

const validatePassword = () => {
  if (!form.password.trim()) {
    errors.password = t('auth.password_required')
  } else if (form.password.length < 8) {
    errors.password = t('auth.password_too_short')
  } else {
    errors.password = ''
  }
  validatePasswordConfirmation()
}

const validatePasswordConfirmation = () => {
  if (!form.password_confirmation.trim()) {
    errors.password_confirmation = t('auth.confirm_password_required')
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = t('auth.passwords_dont_match')
  } else {
    errors.password_confirmation = ''
  }
}

// Validation computed properties
const isStep1Valid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.phone.length <= 15 &&
    form.password.trim() !== '' &&
    form.password.length >= 8 &&
    form.password === form.password_confirmation &&
    !errors.name &&
    !errors.email &&
    !errors.phone &&
    !errors.password &&
    !errors.password_confirmation
  )
})

const isStep2Valid = computed(() => {
  return (
    form.address.trim() !== '' &&
    form.lat.trim() !== '' &&
    form.long.trim() !== '' &&
    !errors.address &&
    !errors.lat &&
    !errors.long
  )
})

const isStep3Valid = computed(() => {
  return (
    form.owner_name.trim() !== '' &&
    form.warehouse_logo !== null &&
    !errors.owner_name &&
    !errors.warehouse_logo
  )
})

// Drag and drop handlers
const handleDragOver = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  isDragging.value[type] = true
}

const handleDragLeave = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  isDragging.value[type] = false
}

const onImageUpload = (event: Event | DragEvent, type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
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
    form[type] = file
    form[`${type}_name`] = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      form[`${type}_preview`] = e.target?.result as string
      if (type === 'warehouse_logo') {
        errors.warehouse_logo = ''
      }
    }
    reader.readAsDataURL(file)
    isDragging.value[type] = false
  }
}

const removeImage = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  form[type] = null
  form[`${type}_name`] = ''
  form[`${type}_preview`] = null
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.value = ''
  if (type === 'warehouse_logo') {
    errors.warehouse_logo = t('auth.warehouse_logo_required')
  }
}

const editImage = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.click()
}

// Fetch address from coordinates using Google Maps Geocoding API
const fetchAddress = async (lat: number, lng: number) => {
   form.address= "mmmm"
}

// Map click handler
const handleMapClick = async (event: any) => {
  const clickedLatLng = event.latLng
  const lat = clickedLatLng.lat()
  const lng = clickedLatLng.lng()
  console.log(event)
  form.lat = lat.toString()
  form.long = lng.toString()
  errors.lat = ''
  errors.long = ''
  await fetchAddress(lat, lng)
}

// Navigation between steps
const nextStep = () => {
  if (currentStep.value === 0) {
    // Validate step 1
    if (!form.name.trim()) errors.name = t('auth.warehouse_name_required')
    if (!form.email.trim()) errors.email = t('auth.email_required')
    validatePhone()
    validatePassword()
    validatePasswordConfirmation()

    if (!isStep1Valid.value) return
  }

  if (currentStep.value === 1) {
    // Validate step 2
    submitted.value = true
    if (!form.address.trim()) errors.address = t('auth.address_required')
    if (!form.lat.trim()) errors.lat = t('auth.latitude_required')
    if (!form.long.trim()) errors.long = t('auth.longitude_required')

    if (!isStep2Valid.value) return
  }

  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Reset form
const resetForm = () => {
  // Reset form data
  form.name = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.password_confirmation = ''
  form.license_number = ''
  form.address = ''
  form.lat = '34.252168898111194'
  form.long = '38.94713447269957'
  form.owner_name = ''
  form.warehouse_license = null
  form.warehouse_license_name = ''
  form.warehouse_license_preview = null
  form.national_id = null
  form.national_id_name = ''
  form.national_id_preview = null
  form.warehouse_logo = null
  form.warehouse_logo_name = ''
  form.warehouse_logo_preview = null

  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.password = ''
  errors.password_confirmation = ''
  errors.address = ''
  errors.lat = ''
  errors.long = ''
  errors.owner_name = ''
  errors.warehouse_logo = ''

  // Reset step
  currentStep.value = 0
  submitted.value = false
  router.push('/')
}

// Form submission
const submitForm = async () => {
  submitted.value = true

  // Validate step 3
  if (!form.owner_name.trim()) {
    errors.owner_name = t('auth.owner_name_required')
  }
  if (!form.warehouse_logo) {
    errors.warehouse_logo = t('auth.warehouse_logo_required')
  }

  if (!isStep3Valid.value) return

  // Prepare form data for submission
  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('email', form.email)
  formData.append('phone', form.phone)
  formData.append('password', form.password)
  formData.append('password_confirmation', form.password_confirmation)
  formData.append('license_number', form.license_number)
  formData.append('address', form.address)
  formData.append('lat', form.lat)
  formData.append('long', form.long)
  formData.append('owner_name', form.owner_name)
  if (form.warehouse_license) formData.append('warehouse_license', form.warehouse_license)
  if (form.national_id) formData.append('national_id', form.national_id)
  if (form.warehouse_logo) formData.append('warehouse_logo', form.warehouse_logo)

  try {
    const response = await axios.post('/api/warehouse-request', formData)

    // Save response data
    requestData.number = response.data.data.number
    requestData.name = response.data.data.name
    requestData.email = response.data.data.email
    requestData.createdAt = response.data.data.created_at

    // Show success toast
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('auth.request_submitted_successfully'),
      life: 3000
    })

    // Move to success step
    currentStep.value = 3
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('auth.warehouse_creation_failed'),
      life: 3000
    })
  }
}
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
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
