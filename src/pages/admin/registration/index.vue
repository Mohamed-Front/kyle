<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const toast = useToast()
const confirm = useConfirm()

// State
const loading = ref(true)
const registrations = ref([])
const searchQuery = ref('')
const selectedRegistrations = ref(null)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)
const totalRecords = ref(0)
const totalPages = ref(1)
const from = ref(0)
const to = ref(0)

// Row action loading
const changingStatus = ref({}) // { id: true }

// Fetch registrations
const fetchRegistrations = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/registration', {
      params: {
        page: currentPage.value,
        limit: rowsPerPage.value,
        search: searchQuery.value
      }
    })
    const res = response.data
    if (res.success) {
      registrations.value = res.data
      const pag = res.pagination || {}
      totalRecords.value = pag.total || 0
      totalPages.value = pag.last_page || 1
      from.value = pag.from || 0
      to.value = pag.to || 0
      currentPage.value = pag.current_page || 1
      rowsPerPage.value = pag.per_page || 10
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل طلبات التسجيل',
      life: 3000
    })
    console.error('Error fetching registrations:', error)
  } finally {
    loading.value = false
  }
}

// Change status function
const changeRegistrationStatus = async (id, status, statusName) => {
  confirm.require({
    message: `هل أنت متأكد من تحديث حالة الطلب إلى "${statusName}"؟`,
    header: 'تأكيد العملية',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'نعم، تأكيد',
    rejectLabel: 'إلغاء',
    accept: async () => {
      changingStatus.value[id] = true
      try {
        await axios.post(`/api/registration/change-status/${id}`, {
          status: status
        })

        toast.add({
          severity: 'success',
          summary: 'تم بنجاح',
          detail: `تم تحديث الحالة إلى "${statusName}"`,
          life: 3000
        })

        // Refresh the list
        await fetchRegistrations()
      } catch (error) {
        const msg = error.response?.data?.message || 'فشل تحديث الحالة'
        toast.add({
          severity: 'error',
          summary: 'خطأ',
          detail: msg,
          life: 5000
        })
      } finally {
        delete changingStatus.value[id]
      }
    }
  })
}

// Watch search and rows per page
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchRegistrations()
})

// Pagination handlers
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchRegistrations()
  }
}

const onPageChange = (event) => {
  rowsPerPage.value = event.rows
  currentPage.value = event.page + 1
  fetchRegistrations()
}

// Get status badge severity
const getStatusSeverity = (status) => {
  switch (status) {
    case 1: return 'info'     // جديد
    case 2: return 'warn'     // قيد الانتظار
    case 3: return 'primary'  // موافق عليه
    case 4: return 'help'     // تحت المعالجة
    case 5: return 'success'  // مكتمل / مغلق
    case 6: return 'danger'   // مرفوض
    default: return 'secondary'
  }
}

onMounted(() => {
  fetchRegistrations()
})
</script>

<template>
  <div class="grid" dir="rtl">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">إدارة طلبات التسجيل</h2>
          </template>
          <template #end>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الجوال..."
                class="w-full md:w-20rem"
              />
            </span>
          </template>
        </Toolbar>

        <Toast position="top-right" />
        <ConfirmDialog />

        <DataTable
          :value="registrations"
          :loading="loading"
          dataKey="id"
          v-model:selection="selectedRegistrations"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="عرض {first} إلى {last} من إجمالي {totalRecords}"
          @page="onPageChange"
          dir="rtl"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />

          <Column field="id" header="الرقم التعريفي" sortable style="min-width: 4rem">
            <template #body="{ data }">
              #{{ data.id }}
            </template>
          </Column>

          <Column field="name" header="الاسم الكامل" sortable style="min-width: 12rem">
            <template #body="{ data }">
              <strong>{{ data.name }}</strong>
            </template>
          </Column>

          <Column field="email" header="البريد الإلكتروني" sortable>
            <template #body="{ data }">
              <a :href="`mailto:${data.email}`" class="text-primary hover:underline">
                {{ data.email }}
              </a>
            </template>
          </Column>


          <Column field="whatsapp" header="واتساب" sortable />

          <Column field="date_of_birth" header="تاريخ الميلاد" sortable>
            <template #body="{ data }">
              {{ new Date(data.date_of_birth).toLocaleDateString('ar-EG') }}
            </template>
          </Column>

          <Column field="status_description" header="الحالة" sortable style="min-width: 10rem">
            <template #body="{ data }">
              <Tag
                :value="data.status_description"
                :severity="getStatusSeverity(data.status)"
                class="text-sm"
              />
            </template>
          </Column>

          <Column header="الإجراءات" style="min-width: 14rem; text-align: center">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">
                <!-- View Details -->
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info p-button-sm"
                  v-tooltip.top="'عرض التفاصيل'"
                  @click="$router.push({ name: 'registration-show', params: { id: data.id } })"
                />

                <!-- Accept & Process (Under Processing) -->
                <Button
                  v-if="data.status !== 4 && data.status !== 5"
                  icon="pi pi-check"
                  class="p-button-rounded p-button-help p-button-sm"
                  v-tooltip.top="'قبول وبدء المعالجة'"
                  :loading="changingStatus[data.id]"
                  @click="changeRegistrationStatus(data.id, 4, 'تحت المعالجة')"
                />

                <!-- Reject / Close -->
                <Button
                  v-if="data.status !== 5"
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger p-button-sm"
                  v-tooltip.top="'رفض أو إغلاق الطلب'"
                  :loading="changingStatus[data.id]"
                  @click="changeRegistrationStatus(data.id, 5, 'مغلق')"
                />

                <!-- Already processed indicator -->
                <Button
                  v-if="data.status === 4 || data.status === 5"
                  :icon="data.status === 4 ? 'pi pi-clock' : 'pi pi-check-circle'"
                  class="p-button-rounded p-button-sm"
                  :class="data.status === 4 ? 'p-button-help' : 'p-button-success'"
                  disabled
                  v-tooltip.top="data.status === 4 ? 'تحت المعالجة' : 'مغلق'"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8 text-gray-500">
              <i class="pi pi-inbox text-4xl mb-3" />
              <p class="text-xl">لا توجد طلبات تسجيل</p>
            </div>
          </template>

          <template #loading>
            <div class="flex justify-content-center align-items-center py-8">
              <ProgressSpinner style="width: 50px; height: 50px" />
              <span class="mr-3 text-lg">جاري التحميل...</span>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* RTL & Arabic Font Improvements */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-family: 'Cairo', 'Geeza Pro', 'Arial', sans-serif;
}

:deep(.p-tag) {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  font-weight: 600;
}

:deep(.p-paginator) {
  font-family: 'Cairo', sans-serif;
}

/* Optional: Add Cairo font from Google Fonts in your main index.html or layout */
</style>
