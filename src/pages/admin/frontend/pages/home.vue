<template>
  <div class="min-h-screen flex flex-col">
    <Nav />

    <!-- Header Section with dynamic background image -->
    <header
      class="relative w-full h-[90vh] bg-cover bg-center"
      :style="{ 'background-image': `url(${mainImagePreview})` }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">إدارة منطقة التل</h1>
        <p class="text-lg md:text-xl max-w-2xl text-center px-4">
          نقدم حلولاً مبتكرة ومستدامة لإدارة وتطوير منطقة التل، مع التركيز على الحفاظ على البيئة الطبيعية وتعزيز جودة الحياة.
        </p>
      </div>
    </header>

    <!-- Main content section -->
    <main class="flex-grow">
      <!-- Your page content goes here -->
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Nav from '../components/nav.vue'
import Footer from '../components/footer.vue'

const settings = ref({
  id: null,
  official_email: '',
  phone: '',
  media: []
})
const mainImage = ref(null)
const mapImage = ref(null)
const mainImagePreview = ref(null)
const mapImagePreview = ref(null)

const fetchData = () => {
  axios.get('/api/setting/not/auth')
    .then((res) => {
      if (res.data.success) {
        settings.value = res.data.data
        const mainImg = res.data.data.media.find(m => m.name === 'main_image')
        const mapImg = res.data.data.media.find(m => m.name === 'map_image')
        mainImagePreview.value = mainImg?.url || null
        mapImagePreview.value = mapImg?.url || null
        toast.add({
          severity: 'success',
          summary: t('نجاح'),
          detail: t('contact.loadSuccess'),
          life: 3000
        })
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('خطأ'),
        detail: t('contact.loadError'),
        life: 3000
      })
      console.error('خطأ في جلب البيانات:', error)
    })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Optional: Add fade-in animation for the header text */
header div {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
