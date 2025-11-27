<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from 'axios'

const toast = useToast()
const loading = ref(true)
const delete_id = ref('')
const contacts = ref(null)
const deleteDialog = ref(false)
const createDialog = ref(false)
const updateDialog = ref(false)
const selectedContacts = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const authorityName = ref('')
const updateId = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteContact = () => {
  axios.delete(`/api/authority/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'نجاح',
        detail: 'تم الحذف بنجاح',
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'حدث خطأ أثناء الحذف',
        life: 3000
      })
    })
}

const openCreateDialog = () => {
  authorityName.value = ''
  createDialog.value = true
}

const openUpdateDialog = (id, name) => {
  updateId.value = id
  authorityName.value = name
  updateDialog.value = true
}

const submitCreate = () => {
  if (!authorityName.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'تحذير',
      detail: 'الاسم مطلوب',
      life: 3000
    })
    return
  }

  axios.post('/api/authority', { name: authorityName.value })
    .then(() => {
      fetchData()
      createDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'نجاح',
        detail: 'تم الإنشاء بنجاح',
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'حدث خطأ أثناء الإنشاء',
        life: 3000
      })
    })
}

const submitUpdate = () => {
  if (!authorityName.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'تحذير',
      detail: 'الاسم مطلوب',
      life: 3000
    })
    return
  }

  axios.put(`/api/authority/${updateId.value}`, { name: authorityName.value })
    .then(() => {
      fetchData()
      updateDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'نجاح',
        detail: 'تم التحديث بنجاح',
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'حدث خطأ أثناء التحديث',
        life: 3000
      })
    })
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get('/api/authority', {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  })
    .then((res) => {
      loading.value = false
      contacts.value = res.data.data
      totalRecords.value = res.data.pagination.total
      totalPages.value = res.data.pagination.last_page
      from.value = res.data.pagination.from
      to.value = res.data.pagination.to
    })
    .catch((error) => {
      loading.value = false
      toast.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'حدث خطأ أثناء تحميل البيانات',
        life: 3000
      })
      console.error('Error fetching data:', error)
    })
}

watch(searchQuery, () => {
  currentPage.value = 1
  fetchData()
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const changeRowsPerPage = (rows) => {
  rowsPerPage.value = rows
  currentPage.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">قائمة الجهات</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" placeholder="بحث" />
              </span>
              <Button
                label="إضافة جهة"
                icon="pi pi-plus"
                class="p-button-success"
                @click="openCreateDialog"
              />
              <Button
                label="تصدير"
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="contacts"
            :loading="loading"
            data-key="id"
            :paginator="false"
            :rows="rowsPerPage"
            :filters="filters"
            :totalRecords="totalRecords"
            responsive-layout="scroll"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="id" header="رقم" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column field="name" header="الاسم" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>

            <Column header="إجراءات" header-style="min-width:12rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-detail mx-2"
                  @click="openUpdateDialog(slotProps.data.id, slotProps.data.name)"
                  v-tooltip.top="'تعديل'"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="'حذف'"
                />
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">لا توجد بيانات</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" />
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="p-paginator p-component p-unselectable-text mt-3" v-if="totalPages > 0">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                عرض {{ from }} إلى {{ to }} من {{ totalRecords }} مدخلات
              </span>
            </div>
            <div class="p-paginator-right-content">
              <span class="p-paginator-pages">
                <button
                  class="p-paginator-first p-paginator-element p-link"
                  :disabled="currentPage === 1"
                  @click="goToPage(1)"
                >
                  <span class="pi-paginator-icon pi pi-angle-double-left"></span>
                </button>
                <button
                  class="p-paginator-prev p-link p-paginator-element"
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
                >
                  <span class="pi pi-paginator-icon pi-angle-left"></span>
                </button>

                <button
                  v-for="page in totalPages"
                  :key="page"
                  class="p-paginator-page p-paginator-element p-link"
                  :class="{ 'p-highlight': currentPage === page }"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>

                <button
                  class="p-paginator-next p-paginator-element p-link"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(currentPage + 1)"
                >
                  <span class="p-paginator-icon pi-angle-right"></span>
                </button>
                <button
                  class="p-paginator-last p-paginator-element p-link"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(totalPages)"
                >
                  <span class="p-paginator-icon pi pi-angle-double-right"></span>
                </button>
              </span>

              <span class="options-p-paginator-rpp-options">
                <Dropdown
                  v-model="rowsPerPage"
                  :options="[5, 10, 20, 30]"
                  @change="changeRowsPerPage"
                  class="ml-2"
                  style="width: 100px;"
                />
              </span>
            </div>
          </div>

          <!-- Create Dialog -->
          <Dialog
            v-model:visible="createDialog"
            :style="{ width: '450px' }"
            header="إضافة جهة جديدة"
            :modal="true"
          >
            <div class="field p-field">
              <label for="authority-name">اسم الجهة</label>
              <InputText
                id="authority-name"
                v-model="authorityName"
                class="w-full mt-2"
                placeholder="أدخل اسم الجهة"
              />
            </div>
            <template #footer>
              <Button
                label="إلغاء"
                icon="pi pi-times"
                class="p-button-text"
                @click="createDialog = false"
              />
              <Button
                label="حفظ"
                icon="pi pi-check"
                class="p-button-success"
                @click="submitCreate"
              />
            </template>
          </Dialog>

          <!-- Update Dialog -->
          <Dialog
            v-model:visible="updateDialog"
            :style="{ width: '450px' }"
            header="تحديث الجهة"
            :modal="true"
          >
            <div class="field">
              <label for="authority-name-update">اسم الجهة</label>
              <InputText
                id="authority-name-update"
                v-model="authorityName"
                class="w-full mt-2"
                placeholder="أدخل اسم الجهة"
              />
            </div>
            <template #footer>
              <Button
                label="إلغاء"
                icon="pi pi-times"
                class="p-button-text"
                @click="updateDialog = false"
              />
              <Button
                label="حفظ"
                icon="pi pi-check"
                class="p-button-success"
                @click="submitUpdate"
              />
            </template>
          </Dialog>

          <!-- Delete Confirmation Dialog -->
          <Dialog
            v-model:visible="deleteDialog"
            :style="{ width: '450px' }"
            header="تأكيد الحذف"
            :modal="true"
          >
            <div class="flex align-items-center justify-content-center">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
              <span>هل أنت متأكد من حذف هذه الجهة؟</span>
            </div>
            <template #footer>
              <Button
                label="لا"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteDialog = false"
              />
              <Button
                label="نعم"
                icon="pi pi-check"
                class="p-button-danger"
                @click="deleteContact"
              />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable) {
  font-size: 0.9rem;

  .p-datatable-thead > tr > th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }

  .p-datatable-tbody > tr {
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--surface-hover);
    }
  }
}

.p-paginator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 3px;

  .p-paginator-left-content {
    color: var(--text-color-secondary);
  }

  .p-paginator-right-content {
    display: flex;
    align-items: center;

    .p-paginator-pages {
      display: flex;
      margin: 0 0.5rem;

      button {
        text-align: center;
        min-width: 2.357rem;
        height: 2.357rem;
        margin: 0.143rem;
        border: 0 none;
        color: var(--text-color-secondary);
        background: transparent;
        border-radius: 50%;
        transition: background-color 0.2s;

        &:hover {
          background: var(--surface-hover);
        }

        &.p-highlight {
          color: var(--primary-color-text);
          background: var(--primary-color);
        }

        &:disabled {
          opacity: 0.5;
          cursor: default;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }

  .p-paginator {
    flex-direction: column;
    gap: 1rem;

    .p-paginator-left-content {
      order: 2;
    }

    .p-paginator-right-content {
      order: 1;
    }
  }
}
</style>
