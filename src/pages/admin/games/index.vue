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

// State
const loading = ref(true)
const products = ref([])
const searchQuery = ref('')
const selectedProducts = ref(null)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)
const totalRecords = ref(0)
const totalPages = ref(1)

// جلب الألعاب (المنتجات)
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/game', {
      params: {
        page: currentPage.value,
        limit: rowsPerPage.value,
        search: searchQuery.value || undefined
      }
    })

    const res = response.data

    if (res.success) {
      products.value = res.data || []
      const pag = res.pagination || {}

      totalRecords.value = pag.total || 0
      totalPages.value = pag.last_page || 1
      currentPage.value = pag.current_page || 1
      rowsPerPage.value = pag.per_page || 10
    } else {
      toast.add({
        severity: 'warn',
        summary: 'تحذير',
        detail: res.message || 'حدث خطأ غير متوقع',
        life: 4000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل الألعاب',
      life: 4000
    })
    console.error('Error fetching games:', error)
  } finally {
    loading.value = false
  }
}

// جلب صورة اللعبة (الاسم في الـ media هو game_image)
const getGameImage = (media) => {
  if (!media || !Array.isArray(media) || media.length === 0) return null
  const img = media.find(m => m.name === 'game_image')
  return img?.url || null
}

// مراقبة البحث وعدد الصفوف
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchProducts()
}, { deep: true })

// تغيير الصفحة في الـ paginator
const onPageChange = (event) => {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="grid" dir="rtl">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold text-primary">إدارة الألعاب</h2>
          </template>
          <template #end>
            <div class="flex gap-3 align-items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="البحث بالاسم..."
                  class="w-full md:w-20rem"
                />
              </span>

              <Button
                label="إضافة لعبة جديدة"
                icon="pi pi-plus"
                class="p-button-success"
                @click="router.push({ name: 'games-create' })"
              />
            </div>
          </template>
        </Toolbar>

        <Toast position="top-right" />
        <ConfirmDialog />

        <DataTable
          :value="products"
          :loading="loading"
          dataKey="id"
          v-model:selection="selectedProducts"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[5, 10, 20, 50, 100]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="عرض {first} إلى {last} من إجمالي {totalRecords} لعبة"
          @page="onPageChange"
          dir="rtl"
        >
          <!-- تحديد متعدد -->
          <Column selectionMode="multiple" headerStyle="width: 3rem" />

          <!-- المعرف -->
          <Column field="id" header="المعرف" sortable style="min-width: 5rem">
            <template #body="{ data }">
              #{{ data.id }}
            </template>
          </Column>

          <!-- الصورة -->
          <Column header="الصورة" style="min-width: 8rem; text-align: center">
            <template #body="{ data }">
              <img
                v-if="getGameImage(data.media)"
                :src="getGameImage(data.media)"
                alt="صورة اللعبة"
                class="w-16 h-16 object-cover rounded-lg shadow-md border border-gray-200"
              />
              <div
                v-else
                class="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center mx-auto"
              >
                <i class="pi pi-image text-gray-400 text-2xl"></i>
              </div>
            </template>
          </Column>

          <!-- اسم اللعبة -->
          <Column field="name" header="اسم اللعبة" sortable style="min-width: 16rem">
            <template #body="{ data }">
              <strong>{{ data.name }}</strong>
            </template>
          </Column>

          <!-- الوصف -->
          <Column header="الوصف" style="min-width: 20rem">
            <template #body="{ data }">
              <div class="line-clamp-3 text-sm text-gray-700">
                {{ data.description || 'لا يوجد وصف' }}
              </div>
            </template>
          </Column>

          <!-- الإجراءات -->
          <Column header="الإجراءات" style="min-width: 12rem; text-align: center">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text p-button-sm"
                  v-tooltip.top="'تعديل'"
                  @click="router.push({ name: 'games-edit', params: { id: data.id } })"
                />

                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text p-button-sm"
                  v-tooltip.top="'حذف'"
                  @click="confirm.require({
                    message: 'هل أنت متأكد من حذف هذه اللعبة نهائيًا؟',
                    header: 'تأكيد الحذف',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'نعم، احذف',
                    rejectLabel: 'إلغاء',
                    accept: async () => {
                      try {
                        await axios.delete(`/api/game/${data.id}`)
                        toast.add({ severity: 'success', summary: 'تم', detail: 'تم حذف اللعبة بنجاح', life: 3000 })
                        fetchProducts() // إعادة تحميل القائمة
                      } catch (err) {
                        toast.add({ severity: 'error', summary: 'فشل', detail: 'تعذر حذف اللعبة', life: 4000 })
                      }
                    }
                  })"
                />
              </div>
            </template>
          </Column>

          <!-- عندما لا تكون هناك بيانات -->
          <template #empty>
            <div class="text-center py-12 text-gray-500">
              <i class="pi pi-box text-6xl mb-4 text-gray-300"></i>
              <p class="text-2xl font-bold">لا توجد ألعاب حاليًا</p>
              <p class="text-lg mt-2">ابدأ بإضافة أول لعبة في متجرك</p>
              <Button
                label="إضافة لعبة جديدة"
                icon="pi pi-plus"
                class="mt-4 p-button-success"
                @click="router.push({ name: 'products-create' })"
              />
            </div>
          </template>

          <!-- أثناء التحميل -->
          <template #loading>
            <div class="flex flex-column align-items-center py-12">
              <ProgressSpinner style="width: 60px; height: 60px" />
              <p class="mt-4 text-xl font-medium text-gray-600">جاري تحميل الألعاب...</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-family: 'Cairo', sans-serif;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  font-family: 'Cairo', sans-serif;
  font-weight: 600;
}

:deep(.p-paginator) {
  font-family: 'Cairo', sans-serif;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.text-success {
  color: #10b981;
  font-weight: 600;
}
</style>
