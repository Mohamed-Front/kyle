<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const gameId = route.params.id

// Form Fields
const name = ref('')
const description = ref('')
const currentImageUrl = ref('') // الصورة الحالية من السيرفر
const imageFile = ref(null)     // الصورة الجديدة (إذا تم رفع واحدة)
const imagePreview = ref(null)  // معاينة الصورة الجديدة
const isDragging = ref(false)
const loading = ref(true)
const submitting = ref(false)

// Drag & Drop
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
    toast.add({ severity: 'warn', summary: 'الحجم كبير', detail: 'الحد الأقصى 10 ميجابايت', life: 4000 })
    return
  }
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeNewImage = () => {
  imageFile.value = null
  imagePreview.value = null
  const input = document.querySelector('input[type="file"]')
  if (input) input.value = ''
}

// جلب بيانات اللعبة عند تحميل الصفحة
const fetchGame = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/game/${gameId}`)
    const game = response.data.data // تأكد من هيكل الـ response

    name.value = game.name || ''
    description.value = game.description || ''

    // جلب رابط الصورة من media
    if (game.media && game.media.length > 0) {
      const img = game.media.find(m => m.name === 'game_image')
      if (img) currentImageUrl.value = img.url
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'فشل التحميل',
      detail: 'تعذر جلب بيانات اللعبة',
      life: 5000
    })
    router.push({ name: 'games' }) // أو اسم الراوت الخاص بقائمة الألعاب
  } finally {
    loading.value = false
  }
}

// تحديث اللعبة
const submitForm = async () => {
  if (!name.value?.trim()) {
    toast.add({ severity: 'error', summary: 'مطلوب', detail: 'اسم اللعبة مطلوب', life: 3000 })
    return
  }
  if (!description.value?.trim()) {
    toast.add({ severity: 'error', summary: 'مطلوب', detail: 'الوصف مطلوب', life: 3000 })
    return
  }

  submitting.value = true

  const formData = new FormData()
  formData.append('name', name.value.trim())
  formData.append('description', description.value.trim())
  formData.append('_method', 'post') // لأن Laravel يحتاج هذا إذا استخدمت POST بدل PUT

  // إذا تم رفع صورة جديدة → أرسلها
  if (imageFile.value) {
    formData.append('game_image', imageFile.value)
  }

  try {
    await axios.post(`/api/game/${gameId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.add({
      severity: 'success',
      summary: 'تم التحديث!',
      detail: 'تم تعديل اللعبة بنجاح',
      life: 4000
    })

    setTimeout(() => {
      router.push({ name: 'games' }) // ارجع للقائمة
    }, 1500)
  } catch (error) {
    const msg = error.response?.data?.message || 'فشل تحديث اللعبة'
    toast.add({ severity: 'error', summary: 'خطأ', detail: msg, life: 5000 })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (gameId) {
    fetchGame()
  } else {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'معرف اللعبة غير موجود', life: 4000 })
    router.push({ name: 'games' })
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6" dir="rtl">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-l from-[#1d1a1a] to-[#474444] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          تعديل اللعبة
        </h1>
        <p class="text-center text-white/90 mt-2 text-lg">
          قم بتعديل بيانات اللعبة الحالية
        </p>
      </div>

      <div class="p-8">
        <!-- حالة التحميل -->
        <div v-if="loading" class="flex flex-column align-items-center py-12">
          <ProgressSpinner style="width: 60px; height: 60px" />
          <p class="mt-4 text-xl text-gray-600">جاري تحميل بيانات اللعبة...</p>
        </div>

        <!-- النموذج -->
        <form v-else @submit.prevent="submitForm" class="space-y-9">

          <!-- اسم اللعبة -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              اسم اللعبة <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="name"
              placeholder="اسم اللعبة"
              class="w-full text-lg py-3"
            />
          </div>

          <!-- الوصف -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              وصف اللعبة <span class="text-red-500">*</span>
            </label>
            <Textarea
              v-model="description"
              rows="7"
              placeholder="وصف مفصل للعبة..."
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

              <!-- إذا تم رفع صورة جديدة → اعرض المعاينة -->
              <div v-if="imagePreview" class="space-y-6">
                <img
                  :src="imagePreview"
                  alt="معاينة الصورة الجديدة"
                  class="mx-auto max-h-96 rounded-xl shadow-2xl object-cover border-4 border-white"
                />
                <div class="flex justify-center gap-4">
                  <Button
                    type="button"
                    label="إزالة الصورة الجديدة"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    @click.stop="removeNewImage"
                  />
                </div>
              </div>

              <!-- إذا لم يتم رفع صورة جديدة → اعرض الصورة الحالية -->
              <div v-else-if="currentImageUrl" class="space-y-6">
                <p class="text-sm text-gray-500 mb-4">الصورة الحالية:</p>
                <img
                  :src="currentImageUrl"
                  alt="غلاف اللعبة الحالي"
                  class="mx-auto max-h-96 rounded-xl shadow-2xl object-cover border-4 border-white"
                />
                <p class="text-sm text-gray-500">اسحب صورة جديدة أو اضغط لتغيير الغلاف</p>
              </div>

              <!-- إذا لا توجد صورة أصلاً -->
              <div v-else class="space-y-5">
                <i class="pi pi-image text-7xl text-gray-400"></i>
                <p class="text-xl font-bold text-gray-700">
                  <span class="text-blue-600 font-extrabold">اضغط للرفع</span> أو اسحب الصورة هنا
                </p>
              </div>
            </div>
          </div>

          <!-- الأزرار -->
          <div class="flex justify-center gap-6 pt-12">
            <Button
              type="button"
              label="إلغاء"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="router.back()"
              :disabled="submitting"
              class="px-10 py-3 text-lg"
            />
            <Button
              type="submit"
              label="حفظ التغييرات"
              icon="pi pi-check"
              :loading="submitting"
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
</style>
