<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()

// حقول النموذج
const title = ref('')
const subtitle = ref('')
const description = ref('')

// رفع الصورة
const imageFile = ref(null)
const imagePreview = ref(null)
const isDragging = ref(false)
const loading = ref(false)

// أحداث السحب والإفلات
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
    toast.add({ severity: 'warn', summary: 'حجم كبير جدًا', detail: 'يجب ألا يتجاوز حجم الصورة 5 ميجابايت', life: 4000 })
    return
  }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  // إعادة تعيين الإدخال
  const input = document.querySelector('input[type="file"]')
  if (input) input.value = ''
}

// إرسال النموذج
const submitForm = async () => {
  if (!title.value.trim()) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'العنوان مطلوب', life: 3000 })
    return
  }
  if (!description.value.trim()) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'الوصف مطلوب', life: 3000 })
    return
  }
  if (!imageFile.value) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'يرجى رفع صورة البانر', life: 3000 })
    return
  }

  loading.value = true
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('subtitle', subtitle.value || '')
  formData.append('description', description.value)
  formData.append('banner_image', imageFile.value)

  try {
    await axios.post('/api/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.add({
      severity: 'success',
      summary: 'تم بنجاح!',
      detail: 'تم إنشاء البانر بنجاح',
      life: 4000
    })

    // إعادة توجيه بعد النجاح
    setTimeout(() => {
      router.push({ name: 'banners' })
    }, 1500)

  } catch (error) {
    const msg = error.response?.data?.message || 'فشل إنشاء البانر'
    toast.add({ severity: 'error', summary: 'خطأ', detail: msg, life: 5000 })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6" dir="rtl">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- العنوان العلوي -->
      <div class="bg-gradient-to-l from-[#2c3e50] to-[#1a2530] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          إضافة بانر ترويجي جديد
        </h1>
        <p class="text-center text-white/80 mt-2 text-lg">أنشئ بانر جذاب للصفحة الرئيسية</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="submitForm" class="space-y-8">

          <!-- العنوان -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              العنوان <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="title"
              placeholder="مثال: تخفيضات الصيف الكبرى 2025"
              class="w-full text-lg py-3"
              required
            />
          </div>

          <!-- العنوان الفرعي -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              العنوان الفرعي <small class="text-gray-500 font-normal">(اختياري)</small>
            </label>
            <InputText
              v-model="subtitle"
              placeholder="مثال: خصم يصل إلى 70% على كل شيء!"
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
              placeholder="اكتب وصفًا جذابًا للعرض الترويجي..."
              class="w-full"
              required
            />
          </div>

          <!-- رفع الصورة -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              صورة البانر <span class="text-red-500">*</span>
            </label>

            <div
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="[
                'relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 shadow-sm',
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              ]"
            >
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="absolute inset-0 opacity-0 cursor-pointer z-10"
                required
              />

              <!-- معاينة الصورة -->
              <div v-if="imagePreview" class="space-y-6">
                <img
                  :src="imagePreview"
                  alt="معاينة البانر"
                  class="mx-auto max-h-96 rounded-xl shadow-2xl object-cover border-4 border-white"
                />
                <div class="flex justify-center gap-4">
                  <Button
                    type="button"
                    label="إزالة الصورة"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    @click.stop="removeImage"
                  />
                  <label class="cursor-pointer">
                    <Button label="تغيير الصورة" icon="pi pi-camera" outlined />
                    <input type="file" accept="image/*" @change="onFileChange" class="hidden" />
                  </label>
                </div>
              </div>

              <!-- نص الرفع -->
              <div v-else class="space-y-5">
                <i class="pi pi-image text-7xl text-gray-400"></i>
                <div>
                  <p class="text-xl font-bold text-gray-700">
                    <span class="text-blue-600 font-extrabold">اضغط للرفع</span> أو اسحب وأفلت الصورة هنا
                  </p>
                  <p class="text-sm text-gray-500 mt-2">
                    المقاس الموصى به: 1920×600 بكسل • صيغ PNG، JPG، WebP • الحد الأقصى 5 ميجابايت
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex justify-center gap-6 pt-12">
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
              label="إنشاء البانر"
              icon="pi pi-plus"
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
/* تحسينات للنصوص العربية والتركيز */
:deep(.p-inputtext),
:deep(.p-textarea) {
  font-family: 'Cairo', 'Tajawal', sans-serif !important;
  font-size: 1.1rem;
}

input:focus, textarea:focus {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* تحسين مظهر الزر عند التحميل */
.p-button:deep(.p-button-label) {
  font-weight: 600;
}
</style>
