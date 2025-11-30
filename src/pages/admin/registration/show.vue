<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'

const route = useRoute()
const toast = useToast()

const loading = ref(true)
const registration = ref(null)
const registrationId = ref(route.params.id)

// Status badge colors (same logic)
const getStatusSeverity = (status) => {
  const map = {
    1: 'info',       // جديد
    2: 'warn',       // قيد الانتظار
    3: 'primary',    // موافق عليه
    4: 'help',       // تحت المعالجة
    5: 'success',    // مكتمل / مغلق
    6: 'danger'      // مرفوض
  }
  return map[status] || 'secondary'
}

// Fetch single registration
const fetchRegistration = async () => {
  try {
    loading.value = true
    const response = await axios.get(`/api/registration/${registrationId.value}`)

    if (response.data.success) {
      registration.value = response.data.data
    } else {
      throw new Error(response.data.message || 'فشل تحميل بيانات الطلب')
    }
  } catch (error) {
    console.error('Error fetching registration:', error)
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: error.response?.data?.message || 'تعذر تحميل تفاصيل الطلب',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRegistration()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8" dir="rtl">
    <div class="card bg-white shadow-xl rounded-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#2c3e50] to-[#1a2530] text-white p-6">
        <div class="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold">تفاصيل طلب التسجيل</h1>
            <p class="text-lg opacity-90 mt-1">رقم الطلب: #{{ registrationId }}</p>
          </div>
          <div v-if="registration">
            <Tag
              :value="registration.status_description"
              :severity="getStatusSeverity(registration.status)"
              class="text-lg px-6 py-3 font-bold"
              rounded
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <ProgressSpinner style="width: 70px; height: 70px" strokeWidth="5" />
        <p class="mt-6 text-xl text-gray-600 font-medium">جاري تحميل تفاصيل الطلب...</p>
      </div>

      <!-- Content -->
      <div v-else-if="registration" class="p-6 md:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <!-- البيانات الشخصية -->
          <div class="space-y-8">
            <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-3">
              البيانات الشخصية
            </h2>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">الاسم الكامل</label>
                <p class="text-xl font-bold text-gray-900">{{ registration.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">البريد الإلكتروني</label>
                <p class="text-lg text-primary hover:underline">
                  <a :href="`mailto:${registration.email}`" class="font-medium">{{ registration.email }}</a>
                </p>
              </div>

              <div v-if="registration.alt_email">
                <label class="block text-sm font-semibold text-gray-600 mb-1">بريد إلكتروني بديل</label>
                <p class="text-lg text-primary hover:underline">
                  <a :href="`mailto:${registration.alt_email}`">{{ registration.alt_email }}</a>
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">رقم الجوال</label>
                <p class="text-lg font-bold text-gray-900" dir="ltr">{{ registration.phone || 'غير محدد' }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">رقم واتساب</label>
                <p class="text-lg font-bold text-gray-900" dir="ltr">{{ registration.whatsapp || 'غير محدد' }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">تاريخ الميلاد</label>
                <p class="text-lg text-gray-900">
                  {{ new Date(registration.date_of_birth).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">العنوان</label>
                <p class="text-lg text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {{ registration.address || 'غير محدد' }}
                </p>
              </div>
            </div>
          </div>

          <!-- معلومات إضافية -->
          <div class="space-y-8">
            <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-3">
              معلومات إضافية
            </h2>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">حساب إنستغرام</label>
                <p class="text-lg">
                  <a
                    v-if="registration.instagram && registration.instagram.startsWith('http')"
                    :href="registration.instagram"
                    target="_blank"
                    class="text-primary hover:underline font-medium"
                  >
                    {{ registration.instagram }}
                  </a>
                  <span v-else class="text-gray-700">{{ registration.instagram || 'غير محدد' }}</span>
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">تجربة المغامرات والعمل الجماعي</label>
                <p class="text-base leading-relaxed bg-gray-50 p-5 rounded-lg text-gray-800">
                  {{ registration.adventure_teamwork || 'لا توجد إجابة' }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">الأمراض المزمنة</label>
                <p class="text-base leading-relaxed bg-gray-50 p-5 rounded-lg text-gray-800">
                  {{ registration.chronic_diseases || 'لا يوجد' }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">حساسية الطعام أو تفضيلات غذائية</label>
                <p class="text-base leading-relaxed bg-gray-50 p-5 rounded-lg text-gray-800">
                  {{ registration.foods || 'لا يوجد' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-start gap-4">
          <Button
            label="تعديل الطلب"
            icon="pi pi-pencil"
            class="p-button-warning p-button-lg"
            @click="$router.push({ name: 'registration-edit', params: { id: registration.id } })"
            v-if="false"
          />

          <Button
            label="رجوع إلى القائمة"
            icon="pi pi-arrow-left"
            class="p-button-secondary p-button-lg"
            @click="$router.push({ name: 'registrations' })"
          />
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="p-16 text-center">
        <i class="pi pi-exclamation-triangle text-8xl text-yellow-500 mb-6"></i>
        <p class="text-2xl font-bold text-gray-700">لم يتم العثور على طلب التسجيل</p>
        <p class="text-lg text-gray-500 mt-3">قد يكون الرقم غير صحيح أو تم حذفه</p>
      </div>
    </div>
  </div>

  <Toast position="top-right" />
</template>

<style scoped>
.card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  font-family: 'Cairo', 'Tajawal', sans-serif;
}

label {
  color: #4b5563;
  font-weight: 600;
}

p {
  margin: 0;
}

/* تحسينات للنصوص العربية */
.text-primary { color: #3b82f6; }
.bg-primary { background-color: #3b82f6; }

/* تأكد من إضافة خط Cairo في index.html */
</style>
