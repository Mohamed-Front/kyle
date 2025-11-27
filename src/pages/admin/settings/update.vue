<script setup>
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()
const toast = useToast()
const loading = ref(true)
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
  loading.value = true
  axios.get('/api/setting')
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
      loading.value = false
    })
    .catch((error) => {
      loading.value = false
      toast.add({
        severity: 'error',
        summary: t('خطأ'),
        detail: t('contact.loadError'),
        life: 3000
      })
      console.error('خطأ في جلب البيانات:', error)
    })
}

const onMainImageSelect = (event) => {
  const file = event.files[0]
  if (file && ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'].includes(file.type)) {
    mainImage.value = file
    mainImagePreview.value = URL.createObjectURL(file)
  } else {
    toast.add({
      severity: 'error',
      summary: t('خطأ'),
      detail: t('settings.invalidMainImage'),
      life: 3000
    })
  }
}

const onMapImageSelect = (event) => {
  const file = event.files[0]
  if (file && ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'].includes(file.type)) {
    mapImage.value = file
    mapImagePreview.value = URL.createObjectURL(file)
  } else {
    toast.add({
      severity: 'error',
      summary: t('خطأ'),
      detail: t('settings.invalidMapImage'),
      life: 3000
    })
  }
}

const saveSettings = () => {
  loading.value = true
  const formData = new FormData()
  formData.append('official_email', settings.value.official_email || '')
  formData.append('phone', settings.value.phone || '')
  if (mainImage.value) {
    formData.append('main_image', mainImage.value, mainImage.value.name)
  }
  if (mapImage.value) {
    formData.append('map_image', mapImage.value, mapImage.value.name)
  } else {
    const existingMapImage = settings.value.media.find(m => m.name === 'map_image')

  }

  axios.post('/api/setting', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
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
          detail: t('contact.saveSuccess'),
          life: 3000
        })
      }
      loading.value = false
    })
    .catch((error) => {
      loading.value = false
      const errorMessages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : t('contact.saveError')
      toast.add({
        severity: 'error',
        summary: t('خطأ'),
        detail: errorMessages,
        life: 5000
      })
      console.error('خطأ في حفظ الإعدادات:', error)
    })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="container mx-auto p-4" dir="rtl">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>
    <div v-else class="card p-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold mb-6">{{ t('settings.title') }}</h1>

      <!-- إدخال البريد الإلكتروني -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('settings.email') }}</label>
        <InputText
          v-model="settings.official_email"
          class="w-full p-2 border rounded-md"
          :placeholder="t('settings.emailPlaceholder')"
        />
      </div>

      <!-- إدخال رقم الهاتف -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('settings.phone') }}</label>
        <InputText
          v-model="settings.phone"
          class="w-full p-2 border rounded-md"
          :placeholder="t('settings.phonePlaceholder')"
        />
      </div>

      <!-- رفع الصورة الرئيسية -->
      <div class="grid lg:grid-cols-2 gap-2 grid-cols-1">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('settings.mainImage') }}</label>
          <FileUpload
            mode="basic"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
            :maxFileSize="10000000"
            chooseLabel="اختيار الصورة الرئيسية"
            class="p-button-outlined p-button-rounded"
            @select="onMainImageSelect"
          />
          <div v-if="mainImagePreview" class="mt-2">
            <img :src="mainImagePreview" alt="معاينة الصورة الرئيسية" class="max-w-xs rounded-lg shadow-md" />
          </div>
        </div>

        <!-- رفع صورة الخريطة -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('settings.mapImage') }}</label>
          <FileUpload
            mode="basic"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
            :maxFileSize="10000000"
            chooseLabel="اختيار صورة الخريطة"
            class="p-button-outlined p-button-rounded"
            @select="onMapImageSelect"
          />
          <div v-if="mapImagePreview" class="mt-2">
            <img :src="mapImagePreview" alt="معاينة صورة الخريطة" class="max-w-xs rounded-lg shadow-md" />
          </div>
        </div>
      </div>

      <!-- زر الحفظ -->
      <Button
        :label="t('settings.save')"
        icon="pi pi-check"
        class="p-button-raised p-button-success"
        @click="saveSettings"
        :disabled="loading"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-2px);
}
.p-fileupload-choose {
  transition: all 0.3s ease;
}
.p-fileupload-choose:hover {
  transform: scale(1.05);
}
</style>
