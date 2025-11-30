<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const postId = route.params.id

// Form Data
const title = ref('')
const content = ref('')
const publishDate = ref(null)

const loading = ref(true)
const submitting = ref(false)

// Images
const currentMainImage = ref('')  // من الـ API
const mainImageFile = ref(null)   // ملف جديد (إذا غيّر المستخدم)
const mainImagePreview = ref(null)

const currentAdditionalImages = ref([])  // { id, url }
const newAdditionalImages = ref([])      // { file, preview } - صور جديدة
const imagesToDelete = ref([])           // معرفات الصور المحذوفة

const isDraggingMain = ref(false)
const isDraggingAdditional = ref(false)

// جلب بيانات المقال
const fetchPost = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/post/${postId}`)
    const post = response.data.data

    title.value = post.title || ''
    content.value = post.content || ''
    publishDate.value = post.date ? new Date(post.date) : null

    // الصورة الرئيسية
    const mainImg = post.media?.find(m => m.name === 'post_main_image')
    if (mainImg) {
      currentMainImage.value = mainImg.url
    }

    // الصور الإضافية
    currentAdditionalImages.value = post.media
      ?.filter(m => m.name === 'post_images')
      .map(m => ({ id: m.id, url: m.url })) || []

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل بيانات المقال',
      life: 5000
    })
    router.push({ name: 'posts' })
  } finally {
    loading.value = false
  }
}

// === الصورة الرئيسية ===
const handleMainImageChange = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ severity: 'warn', summary: 'حجم كبير', detail: 'الحد الأقصى 10 ميجابايت', life: 4000 })
    return
  }
  mainImageFile.value = file
  const reader = new FileReader()
  reader.onload = e => { mainImagePreview.value = e.target.result }
  reader.readAsDataURL(file)
}

const removeMainImage = () => {
  mainImageFile.value = null
  mainImagePreview.value = null
  currentMainImage.value = ''
}

// === الصور الإضافية ===
const addNewImage = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ severity: 'warn', summary: 'حجم كبير', detail: `${file.name} كبير جداً`, life: 3000 })
    return
  }
  const reader = new FileReader()
  reader.onload = e => {
    newAdditionalImages.value.push({ file, preview: e.target.result })
  }
  reader.readAsDataURL(file)
}

const removeCurrentImage = (index) => {
  const img = currentAdditionalImages.value[index]
  imagesToDelete.value.push(img.id)
  currentAdditionalImages.value.splice(index, 1)
}

const removeNewImage = (index) => {
  newAdditionalImages.value.splice(index, 1)
}

// Drag & Drop
const onDropMain = (e) => {
  e.preventDefault()
  isDraggingMain.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) handleMainImageChange(file)
}

const onDropAdditional = (e) => {
  e.preventDefault()
  isDraggingAdditional.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  files.forEach(addNewImage)
}

// إرسال التحديث
const submitForm = async () => {
  if (!title.value.trim()) return toast.add({ severity: 'error', summary: 'مطلوب', detail: 'العنوان مطلوب' })
  if (!content.value.trim()) return toast.add({ severity: 'error', summary: 'مطلوب', detail: 'المحتوى مطلوب' })

  submitting.value = true
  const formData = new FormData()

  formData.append('title', title.value.trim())
  formData.append('content', content.value.trim())
  formData.append('_method', 'POST') // لأن Laravel يحتاج هذا مع POST إذا كان النموذج POST

  if (publishDate.value) {
    const date = new Date(publishDate.value)
    formData.append('date', date.toISOString().split('T')[0])
  }

  // الصورة الرئيسية (إذا تم تغييرها)
  if (mainImageFile.value) {
    formData.append('post_main_image', mainImageFile.value)
  }

  // الصور الجديدة
  newAdditionalImages.value.forEach(img => {
    formData.append('post_images[]', img.file)
  })

  // الصور المحذوفة
  imagesToDelete.value.forEach(id => {
    formData.append('delete_images[]', id)
  })

  try {
    await axios.post(`/api/post/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.add({
      severity: 'success',
      summary: 'تم التحديث!',
      detail: 'تم تعديل المقال بنجاح',
      life: 4000
    })

    setTimeout(() => {
      router.push({ name: 'posts' })
    }, 1500)

  } catch (error) {
    const msg = error.response?.data?.message || 'فشل تحديث المقال'
    toast.add({ severity: 'error', summary: 'خطأ', detail: msg, life: 6000 })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-6" dir="rtl">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-l from-[#1d1a1a] to-[#474444] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          تعديل المقال
        </h1>
        <p class="text-center text-white/90 mt-2 text-lg">قم بتحديث محتوى المقال والصور</p>
      </div>

      <div class="p-8" v-if="!loading">
        <form @submit.prevent="submitForm" class="space-y-10">

          <!-- العنوان والمحتوى -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">عنوان المقال <span class="text-red-500">*</span></label>
            <InputText v-model="title" class="w-full text-lg py-3" placeholder="عنوان المقال" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">محتوى المقال <span class="text-red-500">*</span></label>
            <Textarea v-model="content" rows="10" class="w-full text-base" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">تاريخ النشر</label>
              <Calendar v-model="publishDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
            </div>
          </div>

          <!-- الصورة الرئيسية -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">الصورة الرئيسية</label>
            <div
              @dragover.prevent="isDraggingMain = true"
              @dragleave.prevent="isDraggingMain = false"
              @drop.prevent="onDropMain"
              :class="['relative border-3 border-dashed rounded-2xl p-10 text-center transition-all', isDraggingMain ? 'border-blue-600 bg-blue-50' : 'border-gray-300']"
            >
              <input type="file" accept="image/*" @change="e => handleMainImageChange(e.target.files[0])" class="absolute inset-0 opacity-0 cursor-pointer" />

              <div v-if="mainImagePreview || currentMainImage">
                <img :src="mainImagePreview || currentMainImage" class="mx-auto max-h-96 rounded-xl shadow-lg object-cover" />
                <Button type="button" label="تغيير الصورة" icon="pi pi-camera" class="mt-4" outlined />
                <Button type="button" label="إزالة" icon="pi pi-trash" severity="danger" outlined class="mt-2 mr-2" @click="removeMainImage" />
              </div>

              <div v-else class="space-y-4">
                <i class="pi pi-image text-6xl text-gray-400"></i>
                <p class="text-xl font-bold">اسحب الصورة الرئيسية أو اضغط للرفع</p>
              </div>
            </div>
          </div>



          <!-- الأزرار -->
          <div class="flex justify-center gap-6 pt-10">
            <Button type="button" label="إلغاء" icon="pi pi-times" severity="secondary" outlined @click="router.back()" :disabled="submitting" />
            <Button type="submit" label="حفظ التغييرات" icon="pi pi-check" :loading="submitting" class="px-12 py-3 text-lg font-bold" />
          </div>
        </form>
      </div>

      <!-- حالة التحميل -->
      <div v-else class="flex flex-column align-items-center py-16">
        <ProgressSpinner style="width: 70px; height: 70px" />
        <p class="mt-4 text-xl text-gray-600">جاري تحميل بيانات المقال...</p>
      </div>
    </div>
  </div>

  <Toast position="top-right" />
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-calendar .p-inputtext) {
  font-family: 'Cairo', sans-serif !important;
  font-size: 1.1rem;
}
</style>
