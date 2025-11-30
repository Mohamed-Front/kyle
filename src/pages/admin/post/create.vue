<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()

// Form Fields
const title = ref('')
const content = ref('')
const publishDate = ref(null) // تاريخ النشر

// Images
const mainImageFile = ref(null)
const mainImagePreview = ref(null)

const additionalImages = ref([]) // { file, preview }
const isDraggingMain = ref(false)
const isDraggingAdditional = ref(false)

const loading = ref(false)

// === رفع الصورة الرئيسية (post_main_image) ===
const onDragOverMain = (e) => {
  e.preventDefault()
  isDraggingMain.value = true
}

const onDragLeaveMain = () => {
  isDraggingMain.value = false
}

const onDropMain = (e) => {
  e.preventDefault()
  isDraggingMain.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    handleMainImage(file)
  } else {
    toast.add({ severity: 'warn', summary: 'غير مدعوم', detail: 'يرجى رفع صورة فقط', life: 3000 })
  }
}

const handleMainImage = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ severity: 'error', summary: 'حجم كبير', detail: 'الحد الأقصى 10 ميجابايت', life: 4000 })
    return
  }
  mainImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => (mainImagePreview.value = e.target.result)
  reader.readAsDataURL(file)
}

const removeMainImage = () => {
  mainImageFile.value = null
  mainImagePreview.value = null
}

// === رفع الصور الإضافية (post_images[]) ===
const onDragOverAdditional = (e) => {
  e.preventDefault()
  isDraggingAdditional.value = true
}

const onDragLeaveAdditional = () => {
  isDraggingAdditional.value = false
}

const onDropAdditional = (e) => {
  e.preventDefault()
  isDraggingAdditional.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (files.length === 0) {
    toast.add({ severity: 'warn', summary: 'غير مدعوم', detail: 'يرجى رفع صور فقط', life: 3000 })
    return
  }
  files.forEach(file => addAdditionalImage(file))
}

const onAdditionalFilesChange = (e) => {
  const files = Array.from(e.target.files)
  files.forEach(file => addAdditionalImage(file))
}

const addAdditionalImage = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ severity: 'warn', summary: 'حجم كبير', detail: `${file.name} كبير جداً`, life: 3000 })
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    additionalImages.value.push({
      file,
      preview: e.target.result
    })
  }
  reader.readAsDataURL(file)
}

const removeAdditionalImage = (index) => {
  additionalImages.value.splice(index, 1)
}

// === إرسال النموذج ===
const submitForm = async () => {
  if (!title.value?.trim()) {
    toast.add({ severity: 'error', summary: 'مطلوب', detail: 'عنوان المقال مطلوب', life: 3000 })
    return
  }
  if (!content.value?.trim()) {
    toast.add({ severity: 'error', summary: 'مطلوب', detail: 'محتوى المقال مطلوب', life: 3000 })
    return
  }
  if (!mainImageFile.value) {
    toast.add({ severity: 'error', summary: 'مطلوب', detail: 'يرجى رفع الصورة الرئيسية', life: 3000 })
    return
  }

  loading.value = true
  const formData = new FormData()

  formData.append('title', title.value.trim())
  formData.append('content', content.value.trim())
  if (publishDate.value) {
    const date = new Date(publishDate.value)
    formData.append('date', date.toISOString().split('T')[0]) // YYYY-MM-DD
  }

  // الصورة الرئيسية
  formData.append('post_main_image', mainImageFile.value)

  // الصور الإضافية
  additionalImages.value.forEach((img, index) => {
    formData.append('post_images[]', img.file)
  })

  try {
    const response = await axios.post('/api/post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.add({
      severity: 'success',
      summary: 'تم بنجاح!',
      detail: 'تم إنشاء المقال بنجاح',
      life: 4000
    })

    setTimeout(() => {
      router.push({ name: 'posts' }) // أو اسم الصفحة التي تعرض قائمة المقالات
    }, 1500)

  } catch (error) {
    const msg = error.response?.data?.message || 'فشل إنشاء المقال'
    toast.add({ severity: 'error', summary: 'خطأ', detail: msg, life: 6000 })
    console.error('Create post error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6" dir="rtl">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-l from-[#1d1a1a] to-[#474444] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          إضافة مقال جديد
        </h1>
        <p class="text-center text-white/90 mt-2 text-lg">اكتب مقالك وأضف الصور المناسبة</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="submitForm" class="space-y-10">

          <!-- عنوان المقال -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              عنوان المقال <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="title"
              placeholder="مثال: كيف تبني مدونة احترافية في 2026؟"
              class="w-full text-lg py-3"
            />
          </div>

          <!-- محتوى المقال -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              محتوى المقال <span class="text-red-500">*</span>
            </label>
            <Textarea
              v-model="content"
              rows="10"
              placeholder="اكتب محتوى المقال هنا..."
              class="w-full text-base"
            />
          </div>

          <!-- تاريخ النشر -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                تاريخ النشر
              </label>
              <Calendar
                v-model="publishDate"
                dateFormat="yy-mm-dd"
                placeholder="اختر تاريخ النشر (اختياري)"
                class="w-full"
                showIcon
                iconDisplay="input"
              />
            </div>
          </div>

          <!-- الصورة الرئيسية -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              الصورة الرئيسية <span class="text-red-500">*</span>
            </label>
            <div
              @dragover.prevent="onDragOverMain"
              @dragleave.prevent="onDragLeaveMain"
              @drop.prevent="onDropMain"
              :class="[
                'relative border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all',
                isDraggingMain ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <input type="file" accept="image/*" @change="e => handleMainImage(e.target.files[0])" class="absolute inset-0 opacity-0 cursor-pointer" />

              <div v-if="mainImagePreview" class="space-y-4">
                <img :src="mainImagePreview" alt="الصورة الرئيسية" class="mx-auto max-h-96 rounded-xl shadow-lg object-cover" />
                <Button type="button" label="إزالة الصورة" icon="pi pi-trash" severity="danger" outlined @click="removeMainImage" />
              </div>

              <div v-else class="space-y-4">
                <i class="pi pi-image text-6xl text-gray-400"></i>
                <p class="text-xl font-bold">اسحب الصورة الرئيسية هنا أو اضغط للرفع</p>
                <p class="text-sm text-gray-500">المقاس الموصى: 1200×675 • الحد الأقصى 10 ميجابايت</p>
              </div>
            </div>
          </div>



          <!-- الأزرار -->
          <div class="flex justify-center gap-6 pt-10">
            <Button
              type="button"
              label="إلغاء"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="router.back()"
              :disabled="loading"
              class="px-10 py-3 text-lg"
            />
            <Button
              type="submit"
              label="نشر المقال"
              icon="pi pi-check"
              :loading="loading"
              class="px-12 py-3 text-lg font-bold"
            />
          </div>
        </form>
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

:deep(.p-calendar) {
  width: 100%;
}
</style>
