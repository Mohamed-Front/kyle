<template>
  <Nav></Nav>
  <div class="min-h-[90vh] bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="text-center mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
        الهيكل الإداري – منطقة التل
      </h1>
    </div>

    <!-- Organizational Chart -->
    <div class="w-full max-w-5xl bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
      <!-- Top Level -->
      <div class="flex flex-col items-center mb-4 sm:mb-6">
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full sm:w-64">
          <p class="text-xs sm:text-sm font-medium text-gray-700">13 أعضاء الهيئة الإدارية</p>
          <p class="text-xs sm:text-sm pt-1 text-gray-500">2 رئيس</p>
          <p class="text-xs sm:text-sm pt-1 text-gray-500">6 أعضاء</p>
          <p class="text-xs sm:text-sm pt-1 text-gray-500">5 أعضاء أفضل</p>
        </div>
      </div>

      <!-- Middle Level -->
      <div class="flex justify-center mb-4 sm:mb-6">
        <div class="bg-yellow-200 p-3 sm:p-4 rounded-lg text-center w-full sm:w-48">
          <p class="text-sm sm:text-lg font-semibold text-gray-800">منطقة التل</p>
        </div>
      </div>

      <!-- Second Level -->
      <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-red-200 p-3 sm:p-4 rounded-lg text-center w-full sm:w-32">
          <p class="text-sm sm:text-md font-medium text-gray-800">التل</p>
        </div>
        <div class="bg-red-200 p-3 sm:p-4 rounded-lg text-center w-full sm:w-32">
          <p class="text-sm sm:text-md font-medium text-gray-800">صيدنايا</p>
        </div>
      </div>

      <!-- Third Level -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-800">معربا</p>
        </div>
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-800">منين</p>
        </div>
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-800">حلبون</p>
        </div>
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-800">حفير فوقا</p>
        </div>
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-800">بدا</p>
        </div>
        <div class="bg-green-200 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-800">رنكوس</p>
        </div>
      </div>

      <!-- Bottom Level -->

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <div class="bg-gray-300 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-700">الدريج</p>
        </div>
        <div class="bg-gray-300 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-700">تلفيتا</p>
        </div>
        <div class="bg-gray-300 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-700">عكوبر</p>
        </div>
        <div class="bg-gray-300 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-700">معرة صيدنايا</p>
        </div>
        <div class="bg-gray-300 p-3 sm:p-4 rounded-lg text-center w-full">
          <p class="text-xs sm:text-sm font-medium text-gray-700">حوش عرب</p>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { onMounted } from 'vue';
import Nav from '../components/nav.vue';
import Footer from '../components/footer.vue';
</script>

<style scoped>
/* Custom styles for RTL and additional responsiveness */
.chart-container {
  direction: rtl;
}

/* Ensure text alignment for Arabic */
.text-right {
  text-align: right;
}

/* Smooth transitions for hover effects */
div[class*='bg-']:hover {
  transform: scale(1.00);
  transition: transform 0.2s ease-in-out;
}

/* Adjust font sizes for smaller screens */
@media (max-width: 640px) {
  .text-sm {
    font-size: 0.75rem;
  }
  .text-md {
    font-size: 0.875rem;
  }
}
</style>
