<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

// PrimeVue
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// بيانات النموذج
const title = ref('')
const subtitle = ref('')
const description = ref('')
const currentImageUrl = ref('')  // الصورة الحالية من الخادم
const imageFile = ref(null)     // الصورة الجديدة المرفوعة
const imagePreview = ref('')    // معاينة الصورة (حالية أو جديدة)
const isDragging = ref(false)
const loading = ref(true)
const saving = ref(false)

// جلب بيانات البانر عند التحميل
const loadBanner = async () => {
  try {
    const res = await axios.get(`/api/banner/${route.params.id}`)
    const banner = res.data.data

    title.value = banner.title || ''
    subtitle.value = banner.subtitle || ''
    description.value = banner.description || ''

    // استخراج صورة البانر من مصفوفة media
    const bannerMedia = banner.media?.find(m => m.name === 'banner_image')
    if (bannerMedia && bannerMedia.url) {
      currentImageUrl.value = bannerMedia.url
      imagePreview.value = bannerMedia.url
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل بيانات البانر',
      life: 5000
    })
    console.error('خطأ في جلب البانر:', error)
  } finally {
    loading.value = false
  }
}

// معالجة السحب والإفلات
const onDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    handleImage(file)
  } else {
    toast.add({ severity: 'warn', summary: 'ملف غير صالح', detail: 'يرجى رفع صورة فقط', life: 3000 })
  }
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) handleImage(file)
}

const handleImage = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    toast.add({ severity: 'warn', summary: 'الحجم كبير جدًا', detail: 'يجب ألا يتجاوز حجم الصورة 5 ميجابايت', life: 4000 })
    return
  }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// إلغاء الصورة الجديدة فقط (الرجوع للصورة الأصلية)
const removeNewImage = () => {
  imageFile.value = null
  imagePreview.value = currentImageUrl.value
  const input = document.querySelector('input[type="file"]')
  if (input) input.value = ''
}

// تحديث البانر
const updateBanner = async () => {
  if (!title.value.trim()) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'العنوان مطلوب', life: 3000 })
    return
  }
  if (!description.value.trim()) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'الوصف مطلوب', life: 3000 })
    return
  }

  saving.value = true
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('subtitle', subtitle.value || '')
  formData.append('description', description.value)
  if (imageFile.value) {
    formData.append('banner_image', imageFile.value)
  }
  formData.append('_method', 'post') // Laravel method spoofing

  try {
    await axios.post(`/api/banner/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.add({
      severity: 'success',
      summary: 'تم بنجاح!',
      detail: 'تم تحديث البانر بنجاح',
      life: 4000
    })

    // إعادة توجيه بعد ثانيتين
    setTimeout(() => {
      router.push({ name: 'banners' })
    }, 1500)

  } catch (error) {
    const msg = error.response?.data?.message || 'فشل تحديث البانر'
    toast.add({ severity: 'error', summary: 'خطأ', detail: msg, life: 5000 })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadBanner()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6" dir="rtl">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- العنوان العلوي -->
      <div class="bg-gradient-to-l from-[#2c3e50] to-[#1a2530] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          تعديل البانر رقم #{{ route.params.id }}
        </h1>
        <p class="text-center text-white/80 mt-2 text-lg">قم بتحديث تفاصيل البانر الترويجي</p>
      </div>

      <div class="p-8">

        <!-- حالة التحميل -->
        <div v-if="loading" class="text-center py-20">
          <i class="pi pi-spin pi-spinner text-7xl text-blue-600"></i>
          <p class="mt-6 text-xl font-medium text-gray-600">جاري تحميل بيانات البانر...</p>
        </div>

        <!-- النموذج -->
        <form v-else @submit.prevent="updateBanner" class="space-y-9">

          <!-- العنوان -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              العنوان <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="title"
              placeholder="أدخل عنوان البانر"
              class="w-full text-lg py-3"
            />
          </div>

          <!-- العنوان الفرعي -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              العنوان الفرعي <small class="text-gray-500 font-normal">(اختياري)</small>
            </label>
            <InputText
              v-model="subtitle"
              placeholder="أدخل العنوان الفرعي"
              class="w-full py-3"
            />
          </div>

          <!-- الوصف -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              الوصف <span class="text-red-500">*</span>
            </label>
            <Textarea
              v-model="description"
              rows="6"
              placeholder="أدخل وصف البانر الترويجي..."
              class="w-full"
            />
          </div>

          <!-- قسم الصورة -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              صورة البانر الحالية
            </label>

            <div
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="[
                'relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 shadow-md',
                isDragging ? 'border-blue-500 bg-blue-50/60' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              ]"
            >
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              <!-- معاينة الصورة -->
              <div v-if="imagePreview" class="space-y-6">
                <img
                  :src="imagePreview"
                  alt="معاينة البانر"
                  class="mx-auto max-h-96 rounded-xl shadow-2xl object-cover border-4 border-white"
                />
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-600">
                    {{ imageFile ? 'تم اختيار صورة جديدة (سيتم استبدال الصورة الحالية)' : 'الصورة الحالية للبانر' }}
                  </p>
                </div>

                <div class="flex justify-center gap-4">
                  <Button
                    v-if="imageFile"
                    type="button"
                    label="إلغاء الصورة الجديدة"
                    icon="pi pi-times"
                    severity="secondary"
                    outlined
                    @click.stop="removeNewImage"
                  />

                  <label class="cursor-pointer">
                    <Button
                      :label="imageFile ? 'تغيير الصورة مرة أخرى' : 'استبدال الصورة'"
                      icon="pi pi-camera"
                      outlined
                    />
                    <input type="file" accept="image/*" @change="onFileChange" class="hidden" />
                  </label>
                </div>
              </div>

              <!-- إذا لم تكن هناك صورة -->
              <div v-else class="space-y-5">
                <i class="pi pi-image text-7xl text-gray-400"></i>
                <p class="text-xl font-bold text-gray-700">
                  <span class="text-blue-600 font-extrabold">اضغط أو اسحب</span> لاستبدال الصورة
                </p>
              </div>
            </div>
          </div>

          <!-- أزرار الحفظ والإلغاء -->
          <div class="flex justify-center gap-6 pt-12">
            <Button
              type="button"
              label="إلغاء"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="router.back()"
              :disabled="saving"
              class="px-10 py-3 text-lg"
            />
            <Button
              type="submit"
              label="حفظ التعديلات"
              icon="pi pi-check"
              :loading="saving"
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
/* تحسينات للخط العربي والمظهر */
:deep(.p-inputtext),
:deep(.p-textarea) {
  font-family: 'Cairo', 'Tajawal', sans-serif !important;
  font-size: 1.1rem;
}

/* تأثير دوران لأيقونة التحميل */
.pi-spin {
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
