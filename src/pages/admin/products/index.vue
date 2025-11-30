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

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/product', {
      params: {
        page: currentPage.value,
        limit: rowsPerPage.value,
        search: searchQuery.value
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
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل المنتجات',
      life: 4000
    })
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

// Get product image URL
const getProductImage = (media) => {
  if (!media || media.length === 0) return null
  const img = media.find(m => m.name === 'product_image')
  return img?.url || null
}

// Watch search and rows per page
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchProducts()
})

// Pagination handler
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
            <h2 class="text-2xl font-bold text-primary">إدارة المنتجات</h2>
          </template>
          <template #end>
            <div class="flex gap-3 align-items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="البحث بالاسم أو الرقم التسلسلي..."
                  class="w-full md:w-20rem"
                />
              </span>

              <Button
                label="إضافة منتج جديد"
                icon="pi pi-plus"
                class="p-button-success"
                @click="router.push({ name: 'products-create' })"
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
          currentPageReportTemplate="عرض {first} إلى {last} من إجمالي {totalRecords} منتج"
          @page="onPageChange"
          dir="rtl"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />

          <Column field="id" header="المعرف" sortable style="min-width: 4rem">
            <template #body="{ data }">
              #{{ data.id }}
            </template>
          </Column>

          <Column header="الصورة" style="min-width: 8rem; text-align: center">
            <template #body="{ data }">
              <img
                v-if="getProductImage(data.media)"
                :src="getProductImage(data.media)"
                alt="صورة المنتج"
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

          <Column field="name" header="اسم المنتج" sortable style="min-width: 14rem">
            <template #body="{ data }">
              <strong>{{ data.name }}</strong>
            </template>
          </Column>



          <Column field="price" header="السعر" sortable style="min-width: 8rem">
            <template #body="{ data }">
              <strong class="text-success">{{ data.price }} </strong>
            </template>
          </Column>

          <Column header="الوصف" style="min-width: 16rem">
            <template #body="{ data }">
              <div class="line-clamp-2 text-sm text-gray-700">
                {{ data.description || 'لا يوجد وصف' }}
              </div>
            </template>
          </Column>

          <Column header="الإجراءات" style="min-width: 12rem; text-align: center">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">


                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text p-button-sm"
                  v-tooltip.top="'تعديل'"
                  @click="router.push({ name: 'products-edit', params: { id: data.id } })"
                />

                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text p-button-sm"
                  v-tooltip.top="'حذف'"
                  @click="confirm.require({
                    message: 'هل أنت متأكد من حذف هذا المنتج نهائيًا؟',
                    header: 'تأكيد الحذف',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'نعم، احذف',
                    rejectLabel: 'إلغاء',
                    accept: () => {
                      // هنا يمكنك إضافة حذف المنتج لاحقًا
                      toast.add({ severity: 'info', summary: 'قريبًا', detail: 'خاصية الحذف قيد التطوير', life: 3000 })
                    }
                  })"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-12 text-gray-500">
              <i class="pi pi-box text-6xl mb-4 text-gray-300"></i>
              <p class="text-2xl font-bold">لا توجد منتجات حاليًا</p>
              <p class="text-lg mt-2">ابدأ بإضافة أول منتج في متجرك</p>
              <Button
                label="إضافة منتج جديد"
                icon="pi pi-plus"
                class="mt-4 p-button-success"
                @click="router.push({ name: 'product-create' })"
              />
            </div>
          </template>

          <template #loading>
            <div class="flex flex-column align-items-center py-12">
              <ProgressSpinner style="width: 60px; height: 60px" />
              <p class="mt-4 text-xl font-medium text-gray-600">جاري تحميل المنتجات...</p>
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

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.text-success {
  color: #10b981;
  font-weight: 600;
}
</style>
