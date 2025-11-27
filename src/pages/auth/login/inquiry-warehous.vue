<template>
  <div class="flex flex-col min-h-[75vh] m-auto p-4 mt-4 lg:p-2 bg-gray-100">
    <!-- Title -->
    <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 mb-6 text-center">
      Warehouse Request Details
    </h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg shadow-md text-center">
      {{ error }}
    </div>

    <!-- Form Section -->
    <div v-if="requestData" class="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 class="mb-4 text-xl font-semibold text-gray-800">Basic Information</h3>

            <div>
              <label for="warehouseName" class="block text-sm font-medium text-gray-700">
                Warehouse Name *
              </label>
              <input
                v-model="form.name"
                id="warehouseName"
                name="name"
                type="text"
                :disabled="requestData.data.status_description === 'active'"
                required
                class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                :class="{ 'border-red-500': errors.name, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
              />
              <small class="text-red-600" v-if="errors.name">{{ errors.name }}</small>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                v-model="form.email"
                id="email"
                name="email"
                type="email"
                :disabled="requestData.data.status_description === 'active'"
                required
                class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                :class="{ 'border-red-500': errors.email, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
              />
              <small class="text-red-600" v-if="errors.email">{{ errors.email }}</small>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                v-model="form.phone"
                id="phone"
                name="phone"
                type="tel"
                :disabled="requestData.data.status_description === 'active'"
                required
                class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                :class="{ 'border-red-500': errors.phone, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
                @input="validatePhone"
              />
              <small class="text-red-600" v-if="errors.phone">{{ errors.phone }}</small>
            </div>
          </div>

          <!-- Owner Information -->
          <div class="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 class="mb-4 text-xl font-semibold text-gray-800">Owner Information</h3>

            <div>
              <label for="ownerName" class="block text-sm font-medium text-gray-700">
                Owner Name *
              </label>
              <input
                v-model="form.owner_name"
                id="ownerName"
                name="owner_name"
                type="text"
                :disabled="requestData.data.status_description === 'active'"
                required
                class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                :class="{ 'border-red-500': errors.owner_name, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
              />
              <small class="text-red-600" v-if="errors.owner_name">{{ errors.owner_name }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">National ID</label>
              <div class="flex justify-start">
                <label
                  @dragover.prevent="handleDragOver('national_id')"
                  @dragleave="handleDragLeave('national_id')"
                  @drop.prevent="onImageUpload($event, 'national_id')"
                  :class="{ 'border-green-500 bg-green-50': isDragging.national_id, 'border-gray-300': !isDragging.national_id, 'pointer-events-none opacity-50': requestData.data.status_description === 'active' }"
                  class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer relative"
                >
                  <input
                    type="file"
                    @change="onImageUpload($event, 'national_id')"
                    accept="image/*"
                    class="hidden"
                    id="national_id"
                    :disabled="requestData.data.status_description === 'active'"
                  />
                  <div v-if="form.national_id_preview" class="w-full p-4">
                    <div class="relative group">
                      <img
                        :src="form.national_id_preview"
                        alt="National ID Preview"
                        class="object-cover w-full h-40 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div v-if="requestData.data.status_description !== 'active'" class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                        <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                          <button
                            type="button"
                            @click.stop="removeImage('national_id')"
                            class="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                          >
                            <i class="text-sm pi pi-trash"></i>
                          </button>
                          <button
                            type="button"
                            @click.stop="editImage('national_id')"
                            class="p-2 text-gray-700 bg-white rounded-full hover:bg-gray-100 transition"
                          >
                            <i class="text-sm pi pi-pencil"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p class="mt-2 text-sm text-center text-gray-500">Click or drag to change photo</p>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center w-full p-6">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <i class="text-2xl text-green-500 pi pi-image"></i>
                    </div>
                    <p class="mb-1 text-sm text-center text-gray-600">
                      <span class="font-medium text-green-500">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Warehouse Information -->
          <div class="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 class="mb-4 text-xl font-semibold text-gray-800">Warehouse Information</h3>

            <div>
              <label for="licenseNumber" class="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                v-model="form.license_number"
                id="licenseNumber"
                name="license_number"
                type="text"
                :disabled="requestData.data.status_description === 'active'"
                class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                :class="{ 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Warehouse License</label>
              <div class="flex justify-start">
                <label
                  @dragover.prevent="handleDragOver('warehouse_license')"
                  @dragleave="handleDragLeave('warehouse_license')"
                  @drop.prevent="onImageUpload($event, 'warehouse_license')"
                  :class="{ 'border-green-500 bg-green-50': isDragging.warehouse_license, 'border-gray-300': !isDragging.warehouse_license, 'pointer-events-none opacity-50': requestData.data.status_description === 'active' }"
                  class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer relative"
                >
                  <input
                    type="file"
                    @change="onImageUpload($event, 'warehouse_license')"
                    accept="image/*"
                    class="hidden"
                    id="warehouse_license"
                    :disabled="requestData.data.status_description === 'active'"
                  />
                  <div v-if="form.warehouse_license_preview" class="p-4">
                    <div class="relative group">
                      <img
                        :src="form.warehouse_license_preview"
                        alt="Warehouse License Preview"
                        class="object-cover w-full h-40 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div v-if="requestData.data.status_description !== 'active'" class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                        <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                          <button
                            type="button"
                            @click.stop="removeImage('warehouse_license')"
                            class="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                          >
                            <i class="text-sm pi pi-trash"></i>
                          </button>
                          <button
                            type="button"
                            @click.stop="editImage('warehouse_license')"
                            class="p-2 text-gray-700 bg-white rounded-full hover:bg-gray-100 transition"
                          >
                            <i class="text-sm pi pi-pencil"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p class="mt-2 text-sm text-center text-gray-500">Click or drag to change photo</p>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center p-6">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <i class="text-2xl text-green-500 pi pi-image"></i>
                    </div>
                    <p class="mb-1 text-sm text-center text-gray-600">
                      <span class="font-medium text-green-500">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Warehouse Logo *</label>
              <div class="flex justify-start">
                <label
                  @dragover.prevent="handleDragOver('warehouse_logo')"
                  @dragleave="handleDragLeave('warehouse_logo')"
                  @drop.prevent="onImageUpload($event, 'warehouse_logo')"
                  :class="{ 'border-green-500 bg-green-50': isDragging.warehouse_logo, 'border-gray-300': !isDragging.warehouse_logo, 'pointer-events-none opacity-50': requestData.data.status_description === 'active' }"
                  class="w-full max-w-xs transition-colors duration-300 border-2 border-dashed rounded-lg cursor-pointer relative"
                >
                  <input
                    type="file"
                    @change="onImageUpload($event, 'warehouse_logo')"
                    accept="image/*"
                    class="hidden"
                    id="warehouse_logo"
                    required
                    :disabled="requestData.data.status_description === 'active'"
                  />
                  <div v-if="form.warehouse_logo_preview" class="p-4">
                    <div class="relative group">
                      <img
                        :src="form.warehouse_logo_preview"
                        alt="Warehouse Logo Preview"
                        class="object-cover w-full h-40 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div v-if="requestData.data.status_description !== 'active'" class="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-30">
                        <div class="space-x-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                          <button
                            type="button"
                            @click.stop="removeImage('warehouse_logo')"
                            class="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                          >
                            <i class="text-sm pi pi-trash"></i>
                          </button>
                          <button
                            type="button"
                            @click.stop="editImage('warehouse_logo')"
                            class="p-2 text-gray-700 bg-white rounded-full hover:bg-gray-100 transition"
                          >
                            <i class="text-sm pi pi-pencil"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p class="mt-2 text-sm text-center text-gray-500">Click or drag to change photo</p>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center p-6">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <i class="text-2xl text-green-500 pi pi-image"></i>
                    </div>
                    <p class="mb-1 text-sm text-center text-gray-600">
                      <span class="font-medium text-green-500">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                  </div>
                </label>
              </div>
              <small class="text-red-600" v-if="errors.warehouse_logo">{{ errors.warehouse_logo }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Address *</label>
              <input
                v-model="form.address"
                id="address"
                name="address"
                type="text"
                :disabled="requestData.data.status_description === 'active'"
                required
                class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                :class="{ 'border-red-500': errors.address, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
              />
              <small class="text-red-600" v-if="errors.address">{{ errors.address }}</small>
            </div>
          </div>

          <!-- Location Information -->
          <div class="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 class="mb-4 text-xl font-semibold text-gray-800">Location</h3>
            <div class="mt-1 space-y-4">
              <GoogleMap
                api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas"
                @click="requestData.data.status_description !== 'active' ? handleMapClick : null"
                style="width: 100%; height: 300px"
                :center="{ lat: parseFloat(form.lat || '34.252168898111194'), lng: parseFloat(form.long || '38.94713447269957') }"
                :zoom="14"
                :class="{ 'pointer-events-none opacity-50': requestData.data.status_description === 'active' }"
              >
                <Marker
                  :options="{ position: { lat: parseFloat(form.lat || '34.252168898111194'), lng: parseFloat(form.long || '38.94713447269957') } }"
                />
              </GoogleMap>

              <div class="flex space-x-4">
                <div class="w-1/2 mx-2">
                  <label for="latitude" class="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    v-model="form.lat"
                    id="latitude"
                    name="lat"
                    type="number"
                    step="any"
                    :disabled="requestData.data.status_description === 'active'"
                    required
                    class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                    :class="{ 'border-red-500': errors.lat, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
                  />
                  <small class="text-red-600" v-if="errors.lat">{{ errors.lat }}</small>
                </div>

                <div class="w-1/2">
                  <label for="longitude" class="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    v-model="form.long"
                    id="longitude"
                    name="long"
                    type="number"
                    step="any"
                    :disabled="requestData.data.status_description === 'active'"
                    required
                    class="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                    :class="{ 'border-red-500': errors.long, 'bg-gray-200 cursor-not-allowed': requestData.data.status_description === 'active' }"
                  />
                  <small class="text-red-600" v-if="errors.long">{{ errors.long }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div v-if="requestData.data.status_description !== 'active'" class="flex justify-end mt-8 space-x-4">
        <button
          @click="resetForm"
          type="button"
          class="inline-flex justify-center px-6 py-3 mx-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
        >
          Cancel
        </button>
        <button
          @click="submitForm"
          :disabled="!isFormValid"
          type="button"
          class="inline-flex justify-center mx-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-sm hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Request
        </button>
      </div>

      <!-- Status Badge -->
      <div class="mt-6 text-center">
        <span
          :class="{
            'bg-green-100 text-green-800': requestData.data.status_description === 'active',
            'bg-yellow-100 text-yellow-800': requestData.data.status_description === 'pending',
            'bg-red-100 text-red-800': requestData.data.status_description === 'inactive'
          }"
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
        >
          Status: {{ requestData.data.status_description.charAt(0).toUpperCase() + requestData.data.status_description.slice(1) }}
        </span>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="p-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl text-center max-w-2xl mx-auto mt-6 shadow-lg">
      <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
        <i class="text-3xl text-green-500 pi pi-check"></i>
      </div>
      <h3 class="mb-2 text-2xl font-bold text-green-800">Request Updated Successfully</h3>
      <p class="mb-6 text-gray-600">The warehouse request has been updated in our system.</p>

      <div class="p-4 mb-6 bg-white border border-green-200 rounded-lg shadow-sm">
        <div class="text-sm font-medium text-gray-500">Request Number</div>
        <div class="mt-1 text-2xl font-bold text-green-600">{{ requestNumber }}</div>
      </div>

      <button
        @click="resetForm"
        class="inline-flex justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-sm hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
      >
        Back to Home
      </button>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'

interface FormData {
  name: string
  email: string
  phone: string
  license_number: string
  address: string
  lat: string
  long: string
  owner_name: string
  warehouse_license: File | null
  warehouse_license_name: string
  warehouse_license_preview: string | null
  national_id: File | null
  national_id_name: string
  national_id_preview: string | null
  warehouse_logo: File | null
  warehouse_logo_name: string
  warehouse_logo_preview: string | null
}

interface Errors {
  name: string
  email: string
  phone: string
  address: string
  lat: string
  long: string
  owner_name: string
  warehouse_logo: string
}

const toast = useToast()
const router = useRouter()
const route = useRoute()

const requestNumber = ref<string>('')
const requestData = ref<any>(null)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const success = ref<boolean>(false)
const isDragging = ref({
  warehouse_license: false,
  national_id: false,
  warehouse_logo: false
})

const form = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  license_number: '',
  address: '',
  lat: '34.252168898111194',
  long: '38.94713447269957',
  owner_name: '',
  warehouse_license: null,
  warehouse_license_name: '',
  warehouse_license_preview: null,
  national_id: null,
  national_id_name: '',
  national_id_preview: null,
  warehouse_logo: null,
  warehouse_logo_name: '',
  warehouse_logo_preview: null
})

const errors = reactive<Errors>({
  name: '',
  email: '',
  phone: '',
  address: '',
  lat: '',
  long: '',
  owner_name: '',
  warehouse_logo: ''
})

const validatePhone = () => {
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (form.phone.length > 15) {
    errors.phone = 'Phone number is too long (max 15 characters)'
  } else if (!/^\+?[\d\s-]{8,15}$/.test(form.phone)) {
    errors.phone = 'Invalid phone number format'
  } else {
    errors.phone = ''
  }
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format'
  } else {
    errors.email = ''
  }
}

const isFormValid = computed(() => {
  validatePhone()
  validateEmail()
  return (
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.address.trim() !== '' &&
    form.lat.trim() !== '' &&
    form.long.trim() !== '' &&
    form.owner_name.trim() !== '' &&
    (form.warehouse_logo !== null || form.warehouse_logo_preview !== null) &&
    !errors.name &&
    !errors.email &&
    !errors.phone &&
    !errors.address &&
    !errors.lat &&
    !errors.long &&
    !errors.owner_name &&
    !errors.warehouse_logo
  )
})

const handleDragOver = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  if (requestData.value?.data.status_description !== 'active') {
    isDragging.value[type] = true
  }
}

const handleDragLeave = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  isDragging.value[type] = false
}

const onImageUpload = (event: Event | DragEvent, type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  if (requestData.value?.data.status_description === 'active') return

  const file = (event as DragEvent).dataTransfer?.files?.[0] || (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (!file.type.match('image.*')) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload an image file',
        life: 3000
      })
      return
    }
    if (file.size > 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Image size must be less than 1MB',
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
  if (requestData.value?.data.status_description === 'active') return

  form[type] = null
  form[`${type}_name`] = ''
  form[`${type}_preview`] = null
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.value = ''
  if (type === 'warehouse_logo') {
    errors.warehouse_logo = 'Warehouse logo is required'
  }
}

const editImage = (type: 'warehouse_license' | 'national_id' | 'warehouse_logo') => {
  if (requestData.value?.data.status_description === 'active') return

  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.click()
}

const fetchAddress = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${lat},${lng}`,
          key: 'AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas'
        }
      }
    )
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      form.address = response.data.results[0].formatted_address
      errors.address = ''
    } else {
      form.address = ''
      errors.address = 'Address not found for these coordinates'
    }
  } catch (error) {
    console.error('Error fetching address:', error)
    form.address = ''
    errors.address = 'Failed to fetch address'
  }
}

const handleMapClick = async (event: any) => {
  if (requestData.value?.data.status_description === 'active') return

  const clickedLatLng = event.latLng
  const lat = clickedLatLng.lat()
  const lng = clickedLatLng.lng()
  form.lat = lat.toString()
  form.long = lng.toString()
  errors.lat = ''
  errors.long = ''
  await fetchAddress(lat, lng)
}

const fetchRequestData = async () => {
  if (!requestNumber.value.trim()) {
    error.value = 'Request number is missing'
    return
  }

  loading.value = true
  error.value = null
  try {
    const { data } = await axios.get(`/api/warehouse-request/get/by/${requestNumber.value}`)
    requestData.value = data
    form.name = data.data?.name || ''
    form.email = data.data?.email || ''
    form.phone = data.data?.phone || ''
    form.license_number = data.data?.license_number || ''
    form.address = data.data?.address || ''
    form.lat = data.data?.lat || '34.252168898111194'
    form.long = data.data?.long || '38.94713447269957'
    form.owner_name = data.data?.owner_name || ''

    // Map media URLs to form preview fields
    form.warehouse_license_preview = null
    form.national_id_preview = null
    form.warehouse_logo_preview = null
    form.warehouse_license = null
    form.national_id = null
    form.warehouse_logo = null

    if (data.data?.media) {
      data.data.media.forEach((media: { name: string; url: string }) => {
        if (media.name === 'warehouse_license') {
          form.warehouse_license_preview = media.url
        } else if (media.name === 'national_id') {
          form.national_id_preview = media.url
        } else if (media.name === 'warehouse_logo') {
          form.warehouse_logo_preview = media.url
          form.warehouse_logo = {} as File // Dummy file to satisfy validation
        }
      })
    }
  } catch (err: any) {
    console.error('Error fetching request data:', err)
    error.value = err.response?.data?.message || 'Failed to fetch request data. Please check the request number and try again.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    license_number: '',
    address: '',
    lat: '34.252168898111194',
    long: '38.94713447269957',
    owner_name: '',
    warehouse_license: null,
    warehouse_license_name: '',
    warehouse_license_preview: null,
    national_id: null,
    national_id_name: '',
    national_id_preview: null,
    warehouse_logo: null,
    warehouse_logo_name: '',
    warehouse_logo_preview: null
  })
  Object.assign(errors, {
    name: '',
    email: '',
    phone: '',
    address: '',
    lat: '',
    long: '',
    owner_name: '',
    warehouse_logo: ''
  })
  requestNumber.value = ''
  requestData.value = null
  success.value = false
  router.push('/')
}

const submitForm = async () => {
  if (requestData.value?.data.status_description === 'active') return

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Warehouse name is required'
    isValid = false
  } else {
    errors.name = ''
  }

  validateEmail()
  if (errors.email) isValid = false

  validatePhone()
  if (errors.phone) isValid = false

  if (!form.address.trim()) {
    errors.address = 'Address is required'
    isValid = false
  } else {
    errors.address = ''
  }

  if (!form.lat.trim()) {
    errors.lat = 'Latitude is required'
    isValid = false
  } else if (isNaN(parseFloat(form.lat)) || parseFloat(form.lat) < -90 || parseFloat(form.lat) > 90) {
    errors.lat = 'Invalid latitude'
    isValid = false
  } else {
    errors.lat = ''
  }

  if (!form.long.trim()) {
    errors.long = 'Longitude is required'
    isValid = false
  } else if (isNaN(parseFloat(form.long)) || parseFloat(form.long) < -180 || parseFloat(form.long) > 180) {
    errors.long = 'Invalid longitude'
    isValid = false
  } else {
    errors.long = ''
  }

  if (!form.owner_name.trim()) {
    errors.owner_name = 'Owner name is required'
    isValid = false
  } else {
    errors.owner_name = ''
  }

  if (!form.warehouse_logo && !form.warehouse_logo_preview) {
    errors.warehouse_logo = 'Warehouse logo is required'
    isValid = false
  } else {
    errors.warehouse_logo = ''
  }

  if (!isValid) return

  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('email', form.email)
  formData.append('phone', form.phone)
  formData.append('license_number', form.license_number)
  formData.append('address', form.address)
  formData.append('lat', form.lat)
  formData.append('long', form.long)
  formData.append('owner_name', form.owner_name)
  if (form.warehouse_license) formData.append('warehouse_license', form.warehouse_license)
  if (form.national_id) formData.append('national_id', form.national_id)
  if (form.warehouse_logo) formData.append('warehouse_logo', form.warehouse_logo)

  try {
    loading.value = true
    const response = await axios.post(`/api/warehouse-request/${requestNumber.value}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    requestData.value = response.data.data
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Warehouse request updated successfully',
      life: 3000
    })
    success.value = true
  } catch (err: any) {
    console.error('Error updating form:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.message || 'Failed to update warehouse request',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount using route params
onMounted(() => {
  const id = route.params.id as string
  if (id) {
    requestNumber.value = id
    fetchRequestData()
  } else {
    error.value = 'No request ID provided in the URL'
  }
})
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

.transition-all {
  transition-property: all;
}

.transition-colors {
  transition-property: background-color, border-color, color;
}

.duration-300 {
  transition-duration: 300ms;
}

@media print {
  .no-print {
    display: none;
  }

  body, html {
    background: white !important;
  }

  @page {
    size: auto;
    margin: 10mm;
  }
}
</style>
