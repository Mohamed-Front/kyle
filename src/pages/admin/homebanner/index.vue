<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import axios from 'axios'
import { useRouter } from 'vue-router'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()

// الحالة
const loading = ref(true)
const banners = ref([])
const searchQuery = ref('')
const selectedBanners = ref(null)

// ترقيم الصفحات
const currentPage = ref(1)
const rowsPerPage = ref(10)
const totalRecords = ref(0)
const totalPages = ref(1)
const from = ref(0)
const to = ref(0)

// حالة الحذف
const deletingId = ref(null)

// جلب البانرات
const fetchBanners = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/banner', {
      params: {
        page: currentPage.value,
        limit: rowsPerPage.value,
        search: searchQuery.value
      }
    })

    const res = response.data
    if (res.success) {
      banners.value = res.data || []
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
      detail: 'فشل تحميل البانرات',
      life: 4000
    })
    console.error('Error fetching banners:', error)
  } finally {
    loading.value = false
  }
}

// حذف بانر
const deleteBanner = (id) => {
  confirm.require({
    message: 'هل أنت متأكد من حذف هذا البانر؟ هذا الإجراء لا يمكن التراجع عنه.',
    header: 'تأكيد الحذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'نعم، احذف',
    rejectLabel: 'إلغاء',
    acceptClass: 'p-button-danger',
    accept: async () => {
      deletingId.value = id
      try {
        await axios.delete(`/api/banner/${id}`)
        toast.add({
          severity: 'success',
          summary: 'تم الحذف',
          detail: 'تم حذف البانر بنجاح',
          life: 3000
        })
        await fetchBanners()
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'خطأ',
          detail: error.response?.data?.message || 'فشل حذف البانر',
          life: 5000
        })
      } finally {
        deletingId.value = null
      }
    }
  })
}

// مراقبة البحث وعدد الصفوف
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchBanners()
})

// تغيير الصفحة
const onPageChange = (event) => {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchBanners()
}

onMounted(() => {
  fetchBanners()
})
</script>

<template>
  <div class="grid" dir="rtl">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold text-primary">إدارة البانرات الترويجية</h2>
          </template>
          <template #end>
            <div class="flex gap-3 align-items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="ابحث في البانرات..."
                  class="w-full md:w-20rem"
                />
              </span>

              <Button
                label="إضافة بانر جديد"
                icon="pi pi-plus"
                class="p-button-success"
                @click="router.push({ name: 'banner-create' })"
              />
            </div>
          </template>
        </Toolbar>

        <Toast position="top-right" />
        <ConfirmDialog />

        <DataTable
          :value="banners"
          :loading="loading"
          dataKey="id"
          v-model:selection="selectedBanners"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} بانر"
          @page="onPageChange"
          dir="rtl"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />

          <Column field="id" header="المعرف" sortable style="min-width: 4rem">
            <template #body="{ data }">
              #{{ data.id }}
            </template>
          </Column>

          <Column field="title" header="العنوان" sortable style="min-width: 14rem">
            <template #body="{ data }">
              <strong>{{ data.title }}</strong>
            </template>
          </Column>

          <Column field="subtitle" header="العنوان الفرعي" sortable style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.subtitle || '—' }}
            </template>
          </Column>

          <Column header="الوصف" style="min-width: 16rem">
            <template #body="{ data }">
              <div class="line-clamp-2 text-sm text-600">
                {{ data.description || 'لا يوجد وصف' }}
              </div>
            </template>
          </Column>

          <Column header="الإجراءات" style="min-width: 12rem; text-align: center">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text"
                  v-tooltip.top="'تعديل'"
                  @click="router.push({ name: 'banner-edit', params: { id: data.id } })"
                />

                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  v-tooltip.top="'حذف'"
                  :loading="deletingId === data.id"
                  @click="deleteBanner(data.id)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8 text-gray-500">
              <i class="pi pi-image text-6xl mb-4 text-300" />
              <p class="text-xl font-bold">لا توجد بانرات حالياً</p>
              <p class="text-600 mb-4">ابدأ بإنشاء أول بانر ترويجي لموقعك</p>
              <Button
                label="إنشاء أول بانر"
                icon="pi pi-plus"
                class="p-button-success"
                @click="router.push({ name: 'banner-create' })"
              />
            </div>
          </template>

          <template #loading>
            <div class="flex flex-column align-items-center py-8">
              <ProgressSpinner style="width: 60px; height: 60px" />
              <p class="mt-4 text-lg text-600 font-medium">جاري تحميل البانرات...</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* تحسينات RTL والخطوط العربية */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-family: 'Cairo', 'Tajawal', sans-serif;
}

:deep(.p-paginator),
:deep(.p-datatable .p-datatable-thead > tr > th) {
  font-family: 'Cairo', sans-serif;
  font-weight: 600;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ألوان مخصصة للنصوص */
.text-primary { color: #3b82f6; }
</style>
