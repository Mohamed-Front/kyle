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
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()

// State
const loading = ref(true)
const members = ref([])                 // تم تغيير products → members
const searchQuery = ref('')
const selectedMembers = ref(null)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)
const totalRecords = ref(0)

// Fetch team members
const fetchMembers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/team', {
      params: {
        page: currentPage.value,
        limit: rowsPerPage.value,
        search: searchQuery.value
      }
    })

    const res = response.data
    if (res.success) {
      members.value = res.data || []
      const pag = res.pagination || {}
      totalRecords.value = pag.total || 0
      currentPage.value = pag.current_page || 1
      rowsPerPage.value = pag.per_page || 10
    } else {
      toast.add({
        severity: 'warn',
        summary: 'تحذير',
        detail: res.message || 'لا توجد بيانات',
        life: 4000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل أعضاء الفريق',
      life: 4000
    })
    console.error('Error fetching team members:', error)
  } finally {
    loading.value = false
  }
}

// Get member image (if exists in media array)
const getMemberImage = (media) => {
  if (!media || media.length === 0) return null
  // افتراضيًا نبحث عن صورة باسم "profile" أو أول صورة
  const img = media.find(m => m.name === 'profile' || m.name === 'avatar')
  return img?.url || media[0]?.url || null
}

// Watch search and rows per page changes
watch([searchQuery, rowsPerPage], () => {
  currentPage.value = 1
  fetchMembers()
})

// Pagination handler
const onPageChange = (event) => {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchMembers()
}

onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <div class="grid" dir="rtl">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold text-primary">إدارة أعضاء الفريق</h2>
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
                label="إضافة عضو جديد"
                icon="pi pi-plus"
                class="p-button-success"
                @click="router.push({ name: 'team-create' })"
              />
            </div>
          </template>
        </Toolbar>

        <Toast position="top-right" />
        <ConfirmDialog />

        <DataTable
          :value="members"
          :loading="loading"
          dataKey="id"
          v-model:selection="selectedMembers"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[5, 10, 20, 50, 100]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="عرض {first} إلى {last} من إجمالي {totalRecords} عضو"
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
                v-if="getMemberImage(data.media)"
                :src="getMemberImage(data.media)"
                alt="صورة العضو"
                class="w-16 h-16 object-cover rounded-full shadow-md border-2 border-gray-200"
              />
              <div
                v-else
                class="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-full flex items-center justify-center mx-auto"
              >
                <i class="pi pi-user text-gray-400 text-3xl"></i>
              </div>
            </template>
          </Column>

          <Column field="name" header="اسم العضو" sortable style="min-width: 14rem">
            <template #body="{ data }">
              <strong>{{ data.name }}</strong>
            </template>
          </Column>

          <!-- يمكنك إضافة أعمدة أخرى مثل الوظيفة أو البريد إذا كانت موجودة في الـ API لاحقًا -->

          <Column header="الإجراءات" style="min-width: 12rem; text-align: center">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-center">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text p-button-sm"
                  v-tooltip.top="'تعديل'"
                  @click="router.push({ name: 'team-edit', params: { id: data.id } })"
                />

                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text p-button-sm"
                  v-tooltip.top="'حذف'"
                  @click="confirm.require({
                    message: 'هل أنت متأكد من حذف هذا العضو نهائيًا؟',
                    header: 'تأكيد الحذف',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'نعم، احذف',
                    rejectLabel: 'إلغاء',
                    accept: async () => {
                      try {
                        await axios.delete(`/api/team/${data.id}`)
                        toast.add({
                          severity: 'success',
                          summary: 'تم الحذف',
                          detail: 'تم حذف العضو بنجاح',
                          life: 3000
                        })
                        fetchMembers() // إعادة تحميل القائمة
                      } catch (err) {
                        toast.add({
                          severity: 'error',
                          summary: 'فشل الحذف',
                          detail: 'حدث خطأ أثناء حذف العضو',
                          life: 4000
                        })
                      }
                    }
                  })"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-12 text-gray-500">
              <i class="pi pi-users text-6xl mb-4 text-gray-300"></i>
              <p class="text-2xl font-bold">لا يوجد أعضاء في الفريق حاليًا</p>
              <p class="text-lg mt-2">ابدأ بإضافة أول عضو في فريقك</p>
              <Button
                class="mt-4 p-button-success"
                label="إضافة عضو جديد"
                icon="pi pi-plus"
                @click="router.push({ name: 'team-create' })"
              />
            </div>
          </template>

          <template #loading>
            <div class="flex flex-column align-items-center py-12">
              <ProgressSpinner style="width: 60px; height: 60px" />
              <p class="mt-4 text-xl font-medium text-gray-600">جاري تحميل أعضاء الفريق...</p>
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
</style>
