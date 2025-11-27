<template>
  <div class="flex flex-col lg:flex-row min-h-[70vh] m-auto">
    <!-- Image Section with Overlay -->
    <div class="hidden lg:block lg:w-1/2 relative">
      <img
        src="../../../assets/login.png"
        alt="Inquiry Image"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="text-white p-8 text-center">
          <h2 class="text-3xl font-bold mb-4">{{ $t('inquiry.welcome_to_pharma') }}</h2>
          <p class="text-xl">{{ $t('inquiry.welcome_description') }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ $t('inquiry.check_order_status') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('inquiry.select_order_type') }}
        </p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4">
        <!-- Pharmacy Inquiry Card -->
        <div
          @click="selectType('pharmacy')"
          class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-green-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 cursor-pointer transition-all duration-200"
          :class="{ 'border-green-500 ring-2 ring-green-200': selectedType === 'pharmacy' }"
        >
          <div class="flex-shrink-0 bg-green-100 p-3 mx-2 rounded-full">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-900">
              {{ $t('inquiry.pharmacy') }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ $t('inquiry.pharmacy_description') }}
            </p>
          </div>
        </div>

        <!-- Storehouse Inquiry Card -->
        <div
          @click="selectType('storehouse')"
          class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer transition-all duration-200"
          :class="{ 'border-blue-500 ring-2 ring-blue-200': selectedType === 'storehouse' }"
        >
          <div class="flex-shrink-0 bg-blue-100 p-3 rounded-full mx-2">
            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-900">
              {{ $t('inquiry.storehouse') }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ $t('inquiry.storehouse_description') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Order ID Input -->
      <div class="mt-6">
        <label for="order-id" class="block text-sm font-medium text-gray-700">
          {{ $t('inquiry.order_id') }}
        </label>
        <input
          id="order-id"
          v-model="orderId"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          :placeholder="$t('inquiry.enter_order_id')"
        >
      </div>

      <!-- Submit Button -->
      <div class="mt-6">
        <button
          type="button"
          @click="submitInquiry"
          :disabled="!selectedType || !orderId"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('inquiry.submit') }}
        </button>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const selectedType = ref<'pharmacy' | 'storehouse' | null>(null)
const orderId = ref<string>('')

const selectType = (type: 'pharmacy' | 'storehouse') => {
  selectedType.value = type
}

const submitInquiry = () => {
  if (!selectedType.value || !orderId.value) return

  if (selectedType.value === 'pharmacy') {
    router.push({ name: 'inquiry-warehous',params:{id : orderId.value }})
  } else {
      router.push({ name: 'inquiry-warehous',params:{id : orderId.value }})
  }
}
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
