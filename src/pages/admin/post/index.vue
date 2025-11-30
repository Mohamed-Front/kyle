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
const posts = ref([])
const searchQuery = ref('')
const selectedPosts = ref(null)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)
const totalRecords = ref(0)

// Fetch posts from API
const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/post', {
      params: {
        page: currentPage.value,
        limit: rowsPerPage.value,
        search: searchQuery.value
      }
    })

    const res = response.data
    if (res.success) {
      posts.value = res.data || []
      const pag = res.pagination || {}
      totalRecords.value = pag.total || 0
      currentPage.value = pag.current_page || 1
      rowsPerPage.value = pag.per_page || 10
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل المقالات',
      life: 4000
    })
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

// Get main post image (name: post_main_image)
const getPostImage = (media) => {
  if (!media || media.length === 0) return null
  const img = media.find(m => m.name === 'post_main_image')
  return img?.url || null
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get status tag
const getStatusSeverity = (status) => {
  return status === 1 ? 'success' : 'warning'
}
const getStatusLabel = (status) => {
  return status === 1 ? 'منشور' : 'مسودة'
}

// Watch search and rows per page
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchPosts()
}, { deep: true })

// Pagination handler
const onPageChange = (event) => {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchPosts()
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="grid" dir="rtl">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold text-primary">إدارة المقالات</h2>
          </template>
          <template #end>
            <div class="flex gap-3 align-items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="البحث في العنوان أو المحتوى..."
                  class="w-full md:w-20rem"
                />
              </span>

              <Button
                label="إضافة مقال جديد"
                icon="pi pi-plus"
                class="p-button-success"
                @click="router.push({ name: 'post-create' })"
              />
            </div>
          </template>
        </Toolbar>

        <Toast position="top-right" />
        <ConfirmDialog />

        <DataTable
          :value="posts"
          :loading="loading"
          dataKey="id"
          v-model:selection="selectedPosts"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="عرض {first} إلى {last} من إجمالي {totalRecords} مقال"
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
                v-if="getPostImage(data.media)"
                :src="getPostImage(data.media)"
                alt="صورة المقال"
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

          <Column field="title" header="عنوان المقال" sortable style="min-width: 16rem">
            <template #body="{ data }">
              <strong>{{ data.title }}</strong>
            </template>
          </Column>

          <Column field="content" header="المحتوى" style="min-width: 20rem">
            <template #body="{ data }">
              <div class="line-clamp-3 text-sm text-gray-700">
                {{ data.content || 'لا يوجد محتوى' }}
              </div>
            </template>
          </Column>

          <Column field="date" header="تاريخ النشر" sortable style="min-width: 10rem">
            <template #body="{ data }">
              <span class="text-sm">{{ formatDate(data.date) }}</span>
            </template>
          </Column>

          <Column field="status" header="الحالة" style="min-width: 8rem">
            <template #body="{ data }">
              <Tag
                :severity="getStatusSeverity(data.status)"
                :value="getStatusLabel(data.status)"
                class="text-sm"
              />
            </template>
          </Column>

          <Column header="الإجراءات" style="min-width: 12rem; text-align: center">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">


                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text p-button-sm"
                  v-tooltip.top="'تعديل'"
                  @click="router.push({ name: 'post-edit', params: { id: data.id } })"
                />

                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text p-button-sm"
                  v-tooltip.top="'حذف'"
                  @click="confirm.require({
                    message: 'هل أنت متأكد من حذف هذا المقال نهائيًا؟',
                    header: 'تأكيد الحذف',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'نعم، احذف',
                    rejectLabel: 'إلغاء',
                    accept: () => {
                      toast.add({
                        severity: 'info',
                        summary: 'قريبًا',
                        detail: 'خاصية الحذف قيد التطوير',
                        life: 3000
                      })
                    }
                  })"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-12 text-gray-500">
              <i class="pi pi-file text-6xl mb-4 text-gray-300"></i>
              <p class="text-2xl font-bold">لا توجد مقالات حاليًا</p>
              <p class="text-lg mt-2">ابدأ بكتابة أول مقال في مدونتك</p>
              <Button
                label="إضافة مقال جديد"
                icon="pi pi-plus"
                class="mt-4 p-button-success"
                @click="router.push({ name: 'posts-create' })"
              />
            </div>
          </template>

          <template #loading>
            <div class="flex flex-column align-items-center py-12">
              <ProgressSpinner style="width: 60px; height: 60px" />
              <p class="mt-4 text-xl font-medium text-gray-600">جاري تحميل المقالات...</p>
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
</style>
