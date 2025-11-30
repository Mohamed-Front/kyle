<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const memberId = route.params.id // :id من الراوت

// Form Fields
const name = ref('')
const loading = ref(false)
const submitting = ref(false)

// Image
const imageFile = ref(null)
const imagePreview = ref(null)     // للمعاينة عند رفع صورة جديدة
const currentImageUrl = ref('')    // الصورة الحالية من السيرفر
const isDragging = ref(false)

// جلب بيانات العضو عند التحميل
const fetchMember = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/team/${memberId}`)
    const member = response.data.data // افتراضيًا الـ API يرجع { success: true, data: { ... } }

    name.value = member.name || ''

    // جلب الصورة من media إذا وجدت
    if (member.media && member.media.length > 0) {
      const img = member.media.find(m => m.name === 'member_image' || m.name === 'avatar' || m.name === 'profile')
      if (img) {
        currentImageUrl.value = img.url
        imagePreview.value = img.url // لعرضها في المعاينة أيضًا
      }
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'فشل التحميل',
      detail: 'لا يمكن جلب بيانات العضو',
      life: 5000
    })
    router.push({ name: 'team' }) // ارجع للقائمة إذا فشل
  } finally {
    loading.value = false
  }
}

// Drag & Drop
const onDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}
const onDragLeave = () => (isDragging.value = false)

const onDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) handleImage(file)
  else toast.add({ severity: 'warn', summary: 'خطأ', detail: 'يرجى رفع صورة فقط', life: 3000 })
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) handleImage(file)
}

const handleImage = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ severity: 'warn', summary: 'حجم كبير', detail: 'الحد الأقصى 10 ميجابايت', life: 4000 })
    return
  }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => (imagePreview.value = e.target.result)
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = currentImageUrl.value // ارجع للصورة القديمة إذا أراد إلغاء التغيير
  const input = document.querySelector('input[type="file"]')
  if (input) input.value = ''
}

// Submit Update
const submitForm = async () => {
  if (!name.value?.trim()) {
    toast.add({ severity: 'error', summary: 'مطلوب', detail: 'اسم العضو مطلوب', life: 3000 })
    return
  }

  submitting.value = true
  const formData = new FormData()
  formData.append('name', name.value.trim())
  formData.append('_method', 'POST') // Laravel يحتاج هذا لتحديث عبر POST

  // إذا رفع صورة جديدة، أضفها
  if (imageFile.value) {
    formData.append('member_image', imageFile.value)
  }

  try {
    await axios.post(`/api/team/${memberId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.add({
      severity: 'success',
      summary: 'تم التحديث!',
      detail: 'تم تعديل بيانات العضو بنجاح',
      life: 4000
    })

    setTimeout(() => router.push({ name: 'team' }), 1500)
  } catch (error) {
    const msg = error.response?.data?.message || 'فشل تحديث العضو'
    toast.add({ severity: 'error', summary: 'خطأ', detail: msg, life: 5000 })
  } finally {
    submitting.value = false
  }
}
onMounted(() => {
  fetchMember();
});

</script>

<template>
  <div class="max-w-4xl mx-auto p-6" dir="rtl">
    <div v-if="loading" class="flex justify-center py-20">
      <ProgressSpinner />
    </div>

    <div v-else class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-l from-[#2c3e50] to-[#34495e] px-8 py-7">
        <h1 class="text-3xl font-bold text-white text-center">
          تعديل عضو الفريق
        </h1>
        <p class="text-center text-white/90 mt-2 text-lg">
          يمكنك تعديل الاسم وتغيير الصورة الشخصية
        </p>
      </div>

      <div class="p-8">
        <form @submit.prevent="submitForm" class="space-y-10">

          <!-- اسم العضو -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              اسم العضو <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="name"
              placeholder="أدخل اسم العضو"
              class="w-full text-lg py-3"
            />
          </div>

          <!-- صورة العضو -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              صورة العضو <span class="text-gray-500">(اختياري للتغيير)</span>
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

              <!-- إذا كان هناك صورة (جديدة أو قديمة) -->
              <div v-if="imagePreview" class="space-y-6">
                <img
                  :src="imagePreview"
                  alt="صورة العضو"
                  class="mx-auto w-64 h-64 rounded-full object-cover shadow-2xl border-8 border-white"
                />
                <div class="flex justify-center gap-4">
                  <Button
                    type="button"
                    label="إزالة الصورة الجديدة"
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

              <!-- لا توجد صورة مطلقًا (نعرض نص الرفع -->
              <div v-else class="space-y-5">
                <i class="pi pi-user text-7xl text-gray-400"></i>
                <p class="text-xl font-bold text-gray-700">
                  <span class="text-blue-600 font-extrabold">اضغط لرفع صورة جديدة</span> أو اسحب وأفلت
                </p>
                <p class="text-sm text-gray-500">
                  PNG، JPG، WebP • حتى 10 ميجابايت
                </p>
              </div>
            </div>

            <!-- إظهار الصورة الحالية إذا لم يتم رفع جديدة بعد -->
            <div v-if="currentImageUrl && !imagePreview" class="mt-6 text-center">
              <p class="text-sm text-gray-600 mb-3">الصورة الحالية:</p>
              <img :src="currentImageUrl" class="mx-auto w-48 h-48 rounded-full object-cover border-4 border-gray-200" />
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
              label="حفظ التعديلات"
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
:deep(.p-inputtext) {
  font-family: 'Cairo', sans-serif !important;
  font-size: 1.1rem;
}
</style>
