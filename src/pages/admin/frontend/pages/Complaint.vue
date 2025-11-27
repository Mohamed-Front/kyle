<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Nav />

    <main class="flex-grow p-4 md:p-6 lg:p-8">
      <div class="max-w-5xl mx-auto">
        <Card class="shadow-2xl rounded-xl overflow-hidden animate-fade-in">
          <template #content>
            <!-- Tabs -->
            <TabView v-model:activeIndex="activeTab" class="mb-6">
              <TabPanel header="تقديم شكوى">
                <form @submit.prevent="submitComplaint" class="grid grid-cols-2 lg:grid-cols-2 gap-4 p-4 sm:p-2">
                  <!-- Title -->
                  <div class="col-span-2 text-center">
                    <h1 class="text-2xl sm:text-3xl font-bold text-[#2E5731] mb-2">تقديم شكوى</h1>
                    <p class="text-gray-600 mb-4">املأ النموذج أدناه لتقديم شكوتك</p>
                  </div>

                  <!-- Name -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                      الاسم <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">

                      <InputText
                        id="name"
                        v-model="complaintForm.name"
                        class="w-full"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">

                      <InputText
                        id="email"
                        v-model="complaintForm.email"
                        type="email"
                        class="w-full"
                        placeholder="example@domain.com"
                      />
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">

                      <InputText
                        id="phone"
                        v-model="complaintForm.phone"
                        type="tel"
                        class="w-full"
                        placeholder="05XXXXXXXX"
                      />
                    </div>
                  </div>

                  <!-- Date -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
                      التاريخ <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">

                      <Calendar
                        id="date"
                        v-model="complaintForm.date"
                        class="w-full"
                        dateFormat="yy/mm/dd"
                        placeholder="اختر التاريخ"
                      />
                    </div>
                  </div>

                  <!-- Complaint Type -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                      نوع الشكوى <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">

                      <Dropdown
                        id="type"
                        v-model="complaintForm.type"
                        :options="complaintTypes"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="اختر نوع الشكوى"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <!-- authority_id -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="authority_id" class="block text-sm font-medium text-gray-700 mb-1">
                      الجهة <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">

                      <Dropdown
                        id="authority_id"
                        v-model="complaintForm.authority_id"
                        :options="authorities"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="اختر الجهة"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <!-- Complaint Text -->
                  <div class="col-span-2 lg:col-span-1">
                    <label for="complaint" class="block text-sm font-medium text-gray-700 mb-1">
                      نص الشكوى <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">
                      <Textarea
                        id="complaint"
                        v-model="complaintForm.complaint"
                        rows="5"
                        class="w-full"
                        placeholder="أدخل تفاصيل شكواك هنا..."
                      />
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="text-center mt-2">
                    <Button
                      type="submit"
                      label="إرسال الشكوى"
                      icon="pi pi-send"
                      class="px-6 py-3 bg-gradient-to-r from-[#2E5731] to-[#3a7340] hover:from-[#224225] hover:to-[#2E5731] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      :loading="submitting"
                    />
                  </div>
                </form>
              </TabPanel>

              <TabPanel header="استعلام عن شكوى">
                <div class="p-4 sm:p-6">
                  <!-- Title -->
                  <div class="text-center">
                    <h1 class="text-2xl sm:text-3xl font-bold text-[#2E5731] mb-2">استعلام عن شكوى</h1>
                    <p class="text-gray-600 mb-6">أدخل معلومات الشكوى للاستعلام عن حالتها</p>
                  </div>

                  <!-- Query Form -->
                  <div class="grid grid-cols-1 gap-4 max-w-5Xl mx-auto">
                    <!-- Complaint ID -->
                    <div>
                      <label for="complaintId" class="block text-sm font-medium text-gray-700 mb-1">
                        رقم الشكوى <span class="text-red-500">*</span>
                      </label>
                      <div class="p-inputgroup">

                        <InputText
                          id="complaintId"
                          v-model="queryForm.complaintId"
                          class="w-full"
                          placeholder="أدخل رقم الشكوى"
                          required
                        />
                      </div>
                    </div>

                    <!-- Email -->
                    <div>
                      <label for="queryEmail" class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                      <div class="p-inputgroup">

                        <InputText
                          id="queryEmail"
                          v-model="queryForm.email"
                          type="email"
                          class="w-full"
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>

                    <!-- Phone -->
                    <div>
                      <label for="queryPhone" class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                      <div class="p-inputgroup">

                        <InputText
                          id="queryPhone"
                          v-model="queryForm.phone"
                          type="tel"
                          class="w-full"
                          placeholder="05XXXXXXXX"
                        />
                      </div>
                    </div>

                    <!-- Query Button -->
                    <div class="text-center mt-2">
                      <Button
                        @click="queryComplaint"
                        label="استعلام"
                        icon="pi pi-search"
                        class="px-6 py-3 bg-gradient-to-r from-[#2E5731] to-[#3a7340] hover:from-[#224225] hover:to-[#2E5731] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        :loading="querying"
                      />
                    </div>
                  </div>

                  <!-- Query Result - Fancy Style -->
                  <div v-if="queryResult" class="mt-8 max-w-4xl mx-auto">
                    <div class="bg-gradient-to-r from-[#2E5731] to-[#3a7340] text-white rounded-t-xl p-4 shadow-lg">
                      <h2 class="text-xl font-bold flex items-center justify-center sm:justify-start">
                        <i class="pi pi-info-circle mr-2"></i>
                        <span>تفاصيل الشكوى</span>
                      </h2>
                    </div>

                    <div class="bg-white rounded-b-xl shadow-lg border border-gray-200 overflow-hidden">
                      <!-- Status Badge -->
                      <div class="px-4 sm:px-6 py-3 border-b border-gray-200 bg-gray-50 flex justify-center sm:justify-start">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          :class="{
                            'bg-yellow-100 text-yellow-800': queryResult.status_description === 'قيد المعالجة',
                            'bg-green-100 text-green-800': queryResult.status_description === 'مكتملة',
                            'bg-red-100 text-red-800': queryResult.status_description === 'ملغاة'
                          }">
                          <i class="pi pi-circle-fill text-xs mr-1"></i>
                          {{ queryResult.status_description }}
                        </span>
                      </div>

                      <!-- Complaint Details -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
                        <div class="space-y-4">
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">رقم المرجع</h3>
                            <p class="mt-1 text-lg font-semibold text-[#2E5731]">{{ queryResult.number }}</p>
                          </div>
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">الاسم</h3>
                            <p class="mt-1 text-lg font-semibold">{{ queryResult.name }}</p>
                          </div>
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">البريد الإلكتروني</h3>
                            <p class="mt-1 text-lg break-all">{{ queryResult.email }}</p>
                          </div>
                        </div>

                        <div class="space-y-4">
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">رقم الهاتف</h3>
                            <p class="mt-1 text-lg">{{ queryResult.phone }}</p>
                          </div>
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">تاريخ الشكوى</h3>
                            <p class="mt-1 text-lg">{{ queryResult.date }}</p>
                          </div>
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">نوع الشكوى</h3>
                            <p class="mt-1 text-lg">{{ queryResult.type || 'غير محدد' }}</p>
                          </div>
                          <div>
                            <h3 class="text-sm font-medium text-gray-500">الجهة</h3>
                            <p class="mt-1 text-lg">{{ queryResult.authority_id || 'غير محدد' }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Complaint Text -->
                      <div class="px-4 sm:px-6 pb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">نص الشكوى</h3>
                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p class="whitespace-pre-line">{{ queryResult.complaint }}</p>
                        </div>
                      </div>

                      <!-- Procedures Timeline -->
                      <div v-if="queryResult.procedures && queryResult.procedures.length" class="px-4 sm:px-6 pb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-4">سير الإجراءات</h3>
                        <div class="relative">
                          <!-- Timeline line -->
                          <div class="absolute left-4 top-0 h-full w-0.5 bg-[#2E5731]"></div>

                          <!-- Timeline items -->
                          <div v-for="(procedure, index) in queryResult.procedures" :key="procedure.id"
                              class="relative pl-10 pb-4">
                            <div class="flex items-start">
                              <!-- Timeline dot -->
                              <div class="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#2E5731] ring-4 ring-[#2E5731]/20">
                                <i class="pi pi-check text-white text-xs"></i>
                              </div>

                              <!-- Timeline content -->
                              <div class="flex-1 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
                                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                  <p class="font-medium text-gray-900">{{ procedure.procedure }}</p>
                                  <span class="text-xs text-gray-500 mt-1 sm:mt-0">{{ procedure.created_at }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </template>
        </Card>
      </div>
    </main>

    <!-- Toast for Notifications -->
    <Toast position="top-center" />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Nav from '../components/nav.vue';
import Footer from '../components/footer.vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Calendar from 'primevue/calendar';
import axios from 'axios';

const authorities = ref([]);
const toast = useToast();
const activeTab = ref(0);
const submitting = ref(false);
const querying = ref(false);

const fetchData = () => {
  axios.get('api/complaint/get/create/data').then((res) => {
    authorities.value = res.data.data.authorities;
  });
};

// Complaint Form
const complaintForm = ref({
  name: '',
  email: '',
  phone: '',
  date: '',
  complaint: '',
  type: null,
  authority_id: null,
});

const complaintTypes = ref([
  { label: 'استفسار عام', value: 1 },
  { label: 'شكوى', value: 2 },
  { label: 'اقتراح', value: 3 },
  { label: 'طلب خدمة', value: 4 },
]);

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

const submitComplaint = async () => {
  // Validate each required field and show specific error message
  if (!complaintForm.value.name) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل الاسم مطلوب',
      life: 3000,
    });
    return;
  }

  if (!complaintForm.value.email) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل البريد الإلكتروني مطلوب',
      life: 3000,
    });
    return;
  } else if (!validateEmail(complaintForm.value.email)) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'البريد الإلكتروني غير صالح',
      life: 3000,
    });
    return;
  }

  if (!complaintForm.value.phone) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل رقم الهاتف مطلوب',
      life: 3000,
    });
    return;
  } else if (!validatePhone(complaintForm.value.phone)) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'رقم الهاتف يجب أن يتكون من 10 أرقام',
      life: 3000,
    });
    return;
  }

  if (!complaintForm.value.date) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل التاريخ مطلوب',
      life: 3000,
    });
    return;
  }

  if (!complaintForm.value.type) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل نوع الشكوى مطلوب',
      life: 3000,
    });
    return;
  }

  if (!complaintForm.value.authority_id) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل الجهة مطلوب',
      life: 3000,
    });
    return;
  }

  if (!complaintForm.value.complaint) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'حقل نص الشكوى مطلوب',
      life: 3000,
    });
    return;
  }

  submitting.value = true;

  try {
    const response = await axios.post('/api/complaint', complaintForm.value);
    toast.add({
      severity: 'success',
      summary: 'تم الإرسال',
      detail: 'تم إرسال شكواك بنجاح!',
      life: 3000,
    });

    // Reset form
    complaintForm.value = {
      name: '',
      email: '',
      phone: '',
      date: '',
      complaint: '',
      type: null,
      authority_id: null
    };

    // Switch to query tab
    activeTab.value = 1;
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء إرسال الشكوى. حاول مرة أخرى.';

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response && error.response.data && error.response.data.errors) {
      errorMessage = Object.values(error.response.data.errors).flat().join(' ');
    }

    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: errorMessage,
      life: 5000,
    });
  } finally {
    submitting.value = false;
  }
};

// Query Form
const queryForm = ref({
  complaintId: '',
  email: '',
  phone: '',
});

const queryResult = ref(null);

const queryComplaint = async () => {
  if (!queryForm.value.complaintId) {
    toast.add({
      severity: 'warn',
      summary: 'خطأ',
      detail: 'يرجى إدخال رقم الشكوى',
      life: 3000,
    });
    return;
  }

  querying.value = true;

  try {
    const params = {};
    if (queryForm.value.email) params.email = queryForm.value.email;
    if (queryForm.value.phone) params.phone = queryForm.value.phone;

    const response = await axios.get(`/api/complaint/get/by/${queryForm.value.complaintId}`, { params });
    const data = response.data.data;

    queryResult.value = {
      id: data.id || 'غير متوفر',
      number: data.number || 'غير متوفر',
      name: data.name || 'غير متوفر',
      email: data.email || 'غير متوفر',
      phone: data.phone || 'غير متوفر',
      date: data.date ? new Date(data.date).toLocaleDateString('ar-SA') : 'غير متوفر',
      complaint: data.complaint || 'غير متوفر',
      type: data.type ? complaintTypes.value.find(t => t.value === data.type)?.label : 'غير محدد',
      authority_id: data.authority_id ? authorities.value.find(a => a.id === data.authority_id)?.name : 'غير محدد',
      status_description: data.status_description || 'قيد المعالجة',
      procedures: data.procedures || [],
    };

    toast.add({
      severity: 'success',
      summary: 'تم الاستعلام',
      detail: 'تم العثور على الشكوى بنجاح!',
      life: 3000,
    });
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء الاستعلام عن الشكوى. حاول مرة أخرى.';

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response && error.response.status === 404) {
      errorMessage = 'لم يتم العثور على شكوى بهذا الرقم';
    }

    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: errorMessage,
      life: 5000,
    });
    queryResult.value = null;
  } finally {
    querying.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Animation for card */
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom styles for tabs */
:deep(.p-tabview-nav) {
  @apply bg-white rounded-t-xl overflow-hidden;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  @apply text-[#224225] font-semibold px-4 sm:px-6 py-3 hover:bg-[#224225]/10 transition-all duration-300;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  @apply bg-[#224225] text-white;
}

:deep(.p-tabview-panels) {
  @apply bg-white rounded-b-xl;
}

/* Custom styles for form inputs */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-textarea),
:deep(.p-calendar) {
  @apply w-full border-gray-300 focus:border-[#2E5731] focus:ring-[#2E5731]/50 transition-all duration-300;
}

:deep(.p-inputgroup-addon) {
  @apply bg-gray-100 border-gray-300 text-gray-600;
}

:deep(.p-button) {
  @apply font-semibold;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.p-tabview-nav li .p-tabview-nav-link) {
    @apply px-3 py-2 text-sm;
  }

  :deep(.p-inputgroup-addon) {
    @apply px-2;
  }
}
</style>
