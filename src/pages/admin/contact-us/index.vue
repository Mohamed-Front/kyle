<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const delete_id = ref('')
const contacts = ref(null)
const deleteDialog = ref(false)
const notesDialog = ref(false)
const selectedContacts = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const notes = ref('')
const currentContactId = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

// Status options for dropdown
const statusOptions = ref([
  { label: 'انتظار', value: 2 },
  { label: 'نشط', value: 1 },
  { label: 'غير نشط', value: 3 }
])

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteContact = () => {
  axios.delete(`/api/contact-us/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('نجاح'),
        detail: t('تم تغيير الحاله بنجاح'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('خطأ'),
        detail: t('contact.deleteError'),
        life: 3000
      })
    })
}

const openNotesDialog = (id) => {
  currentContactId.value = id
  notes.value = ''
  notesDialog.value = true
}

const submitNotes = () => {
  if (!notes.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: t('تحذير'),
      detail: t('contact.notesRequired'),
      life: 3000
    })
    return
  }

  axios.post(`/api/contact-us/add/notes/${currentContactId.value}`, { notes: notes.value })
    .then(() => {
      fetchData()
      notesDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('نجاح'),
        detail: t('contact.notesSuccess'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('خطأ'),
        detail: t('contact.notesError'),
        life: 3000
      })
    })
}

const updateStatus = (id, newStatus) => {
  axios.post(`/api/contact-us/change/status/${id}`, { status: newStatus })
    .then(() => {
      fetchData()
      toast.add({
        severity: 'success',
        summary: t('نجاح'),
       detail: t('تم تغيير الحاله بنجاح'),
        life: 3000
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('خطأ'),
        detail: t('contact.updateError'),
        life: 3000
      })
      console.error('Error updating status:', error)
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
  axios.get('/api/contact-us', {
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
        summary: t('خطأ'),
        detail: t('contact.loadError'),
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

const openNew = () => {
  router.push({ name: 'contact-create' })
}

const editContact = (id) => {
  router.push({ name: 'contact_show', params: { id: id } })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('اتصل بنا') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('بحث')" />
              </span>
              <Button
                :label="t('تصدير')"
                icon="pi pi-upload"
                class="p-export"
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

            <Column field="id" :header="t('رقم')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column field="name" :header="t('اسم')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>

            <Column field="email" :header="t('بريد إلكتروني')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.email }}
              </template>
            </Column>

            <Column field="type" :header="t('نوع')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.type }}
              </template>
            </Column>

            <Column field="date" :header="t('تاريخ')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.date }}
              </template>
            </Column>

            <Column field="status_description" :header="t('وصف الحالة')" :sortable="true" header-style="width:20%; min-width:15rem;">
              <template #body="slotProps">
                {{ slotProps.data.status_description || '-' }}
              </template>
            </Column>

            <Column field="status" :header="t('حالة')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <Dropdown
                  v-model="slotProps.data.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="t('اختر الحالة')"
                  class="w-full"
                  @change="updateStatus(slotProps.data.id, $event.value)"
                />
              </template>
            </Column>

            <Column :header="t('إجراءات')" header-style="min-width:12rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="editContact(slotProps.data.id)"
                  v-tooltip.top="t('تعديل')"
                />

              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ t('لا توجد بيانات') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="p-paginator p-component p-unselectable-text mt-3" v-if="totalPages > 0">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ t('عرض') }} {{ from }} {{ t('إلى') }} {{ to }} {{ t('من') }} {{ totalRecords }} {{ t('مدخلات') }}
              </span>
            </div>
            <div class="p-paginator-right-content">
              <span class="p-paginator-pages">
                <button
                  class="p-paginator-first p-paginator-element p-link"
                  :disabled="currentPage === 1"
                  @click="goToPage(1)"
                >
                  <span class="p-paginator-icon pi pi-angle-double-left"></span>
                </button>
                <button
                  class="p-paginator-prev p-paginator-element p-link"
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
                >
                  <span class="p-paginator-icon pi pi-angle-left"></span>
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
                  <span class="p-paginator-icon pi pi-angle-right"></span>
                </button>
                <button
                  class="p-paginator-last p-paginator-element p-link"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(totalPages)"
                >
                  <span class="p-paginator-icon pi pi-angle-double-right"></span>
                </button>
              </span>

              <span class="p-paginator-rpp-options">
                <Dropdown
                  v-model="rowsPerPage"
                  :options="[5, 10, 20, 30]"
                  @change="changeRowsPerPage($event.value)"
                  class="ml-2"
                  style="width: 100px"
                />
              </span>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('تأكيد الحذف')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('هل أنت متأكد من حذف هذا الاتصال؟') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('لا')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label="t('نعم')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteContact"
            />
          </template>
        </Dialog>

        <!-- Add Notes Dialog -->
        <Dialog
          v-model:visible="notesDialog"
          :style="{ width: '450px' }"
          :header="t('إضافة ملاحظات')"
          :modal="true"
        >
          <div class="field">
            <label for="notes">{{ t('ملاحظات') }}</label>
            <Textarea
              id="notes"
              v-model="notes"
              :autoResize="true"
              rows="5"
              class="w-full mt-2"
              :placeholder="t('أدخل ملاحظاتك هنا')"
            />
          </div>
          <template #footer>
            <Button
              :label="t('إلغاء')"
              icon="pi pi-times"
              class="p-button-text"
              @click="notesDialog = false"
            />
            <Button
              :label="t('حفظ')"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="submitNotes"
            />
          </template>
        </Dialog>
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

  :deep(.p-dropdown) {
    width: 100%;
    min-width: 8rem;
    border: 1px solid var(--surface-border);
    border-radius: 3px;
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
