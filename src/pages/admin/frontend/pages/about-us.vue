<template>
  <Nav />
  <div class=" mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div class="p-4 sm:p-6 lg:p-8">
        <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-4 sm:gap-6">
          <!-- الاسم -->
          <div class="col-span-1 text-center">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">تواصل معنـــا</h1>
          </div>

          <!-- الاسم -->
          <div class="col-span-1">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <InputText
              id="name"
              v-model="form.name"
              class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <!-- البريد الإلكتروني و رقم الهاتف -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- البريد الإلكتروني -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <!-- رقم الهاتف -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <InputText
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <!-- رقم الهوية أو الإقامة و نوع المراسلة -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- رقم الهوية أو الإقامة -->
            <div>
              <label for="id_number" class="block text-sm font-medium text-gray-700 mb-1">رقم الهوية أو الإقامة</label>
              <InputText
                id="id_number"
                v-model="form.id_number"
                class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <!-- نوع المراسلة -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">نوع المراسلة</label>
              <Dropdown
                id="type"
                v-model="form.type"
                :options="types"
                optionLabel="label"
                optionValue="value"
                placeholder="اختر نوع المراسلة"
                class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <!-- العنوان -->
          <div class="col-span-1">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <InputText
              id="title"
              v-model="form.title"
              class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <!-- نص الرسالة -->
          <div class="col-span-1">
            <label for="body" class="block text-sm font-medium text-gray-700 mb-1">نص الرسالة</label>
            <Textarea
              id="body"
              v-model="form.body"
              rows="5"
              class="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <!-- زر الإرسال -->
          <div class="col-span-1 flex justify-center sm:justify-start">
            <Button
              type="submit"
              label="إرسال"
              icon="pi pi-send"
              class="w-full sm:w-32 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4 transition-colors duration-200"
              :disabled="isSubmitting"
            />
          </div>
        </form>
      </div>
    </div>

    <!-- Toast لعرض الرسائل -->
    <Toast />
  </div>
  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Footer from '../components/footer.vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Nav from '../components/nav.vue';
import axios from 'axios';

const toast = useToast();
const isSubmitting = ref(false);

const form = ref({
  name: '',
  email: '',
  phone: '',
  id_number: '',
  type: '',
  title: '',
  body: ''
});

const types = ref([
  { label: 'استفسار عام', value: 1 },
  { label: 'شكوى', value: 2 },
  { label: 'اقتراح', value: 3 },
  { label: 'طلب خدمة', value: 4 }
]);

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    await axios.post('/api/contact-us', form.value);
    toast.add({
      severity: 'success',
      summary: 'تم الإرسال',
      detail: 'تم إرسال رسالتك بنجاح!',
      life: 3000
    });
    form.value = {
      name: '',
      email: '',
      phone: '',
      id_number: '',
      type: '',
      title: '',
      body: ''
    };
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'حدث خطأ أثناء إرسال الرسالة',
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* No additional CSS needed as Tailwind handles styling */
</style>
