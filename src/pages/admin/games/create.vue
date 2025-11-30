
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

// Form Fields
const name = ref('')
const description = ref('')

// Image Upload
const imageFile = ref(null)
const imagePreview = ref(null)
const isDragging = ref(false)
const loading = ref(false)

// Drag & Drop Events
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
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ severity: 'warn', summary: 'الحجم كبير', detail: 'يجب ألا يتجاوز حجم الصورة 10 ميجابايت', life: 4000 })
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
  const input = document.querySelector('input[type="file"]')
  if (input) input.value = ''
}

// Submit Form - إرسال لعبة جديدة
const submitForm = async () => {
  // التحقق من الحقول
  if (!name.value?.trim()) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'اسم اللعبة مطلوب', life: 3000 })
    return
  }
  if (!description.value?.trim()) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'الوصف مطلوب', life: 3000 })
    return
  }
  if (!imageFile.value) {
    toast.add({ severity: 'error', summary: 'حقل مطلوب', detail: 'يرجى رفع صورة اللعبة', life: 3000 })
    return
  }

  loading.value = true

  const formData = new FormData()
  formData.append('name', name.value.trim())
  formData.append('description', description.value.trim())
  formData.append('game_image', imageFile.value) // هذا هو المفتاح الصحيح في الـ backend

  try {
    const response = await axios.post('/api/game', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    toast.add({
      severity: 'success',
      summary: 'تم بنجاح!',
      detail: 'تم إضافة اللعبة بنجاح',
      life: 4000
    })

    // إعادة توجيه بعد النجاح
    setTimeout(() => {
      router.push({ name: 'games' }) // أو 'products' إذا كان اسم الراوت كذلك
    }, 1500)

  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data?.error || 'فشل إضافة اللعبة'
    toast.add({
      severity: 'error',
      summary: 'فشل الإضافة',
      detail: msg,
      life: 5000
    })
    console.error('Error adding game:', error.response?.data || error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6" dir="rtl">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-l from-[#1d1a1a] to-[#474444] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          إضافة لعبة جديدة
        </h1>
        <p class="text-center text-white/90 mt-2 text-lg">
          أدخل تفاصيل اللعبة لإضافتها إلى المكتبة
        </p>
      </div>

      <div class="p-8">
        <form @submit.prevent="submitForm" class="space-y-9">

          <!-- اسم اللعبة -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              اسم اللعبة <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="name"
              placeholder="مثال: GTA V - Premium Edition"
              class="w-full text-lg py-3"
              :class="{ 'p-invalid': !name && submitted }"
            />
          </div>


          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              وصف اللعبة <span class="text-red-500">*</span>
            </label>
            <Textarea
              v-model="description"
              rows="7"
              placeholder="اكتب وصفًا جذابًا عن اللعبة، القصة، المميزات، متطلبات التشغيل..."
              class="w-full text-base"
            />
          </div>

          <!-- صورة اللعبة -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              صورة اللعبة (الغلاف) <span class="text-red-500">*</span>
            </label>

            <div
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="[
                'relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 shadow-md',
                isDragging ? 'border-blue-600 bg-blue-50/70' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
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
                  alt="معاينة غلاف اللعبة"
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

              <!-- منطقة السحب والإفلات -->
              <div v-else class="space-y-5">
                <i class="pi pi-image text-7xl text-gray-400"></i>
                <div>
                  <p class="text-xl font-bold text-gray-700">
                    <span class="text-blue-600 font-extrabold">اضغط للرفع</span> أو اسحب وأفلت الصورة هنا
                  </p>
                  <p class="text-sm text-gray-500 mt-2">
                    المقاس الموصى: 800×1200 أو 1080×1920 • صيغ PNG، JPG، WebP • الحد الأقصى 10 ميجابايت
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- أزرار الإرسال -->
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
              label="إضافة اللعبة"
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
:deep(.p-inputtext),
:deep(.p-textarea) {
  font-family: 'Cairo', sans-serif !important;
  font-size: 1.1rem;
}

:deep(.p-inputtext::placeholder),
:deep(.p-textarea::placeholder) {
  color: #9ca3af;
}
</style>
