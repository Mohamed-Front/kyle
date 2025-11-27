<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from "axios"
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const delete_id = ref('')
const reject_id = ref('')
const accept_id = ref('')
const warehouseRequests = ref(null)
const deleteDialog = ref(false)
const rejectDialog = ref(false)
const acceptDialog = ref(false)
const selectedRequests = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const rejected_message = ref('')

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

const confirmReject = (id) => {
  reject_id.value = id
  rejected_message.value = ''
  rejectDialog.value = true
}

const confirmAccept = (id) => {
  accept_id.value = id
  acceptDialog.value = true
}

const deleteRequest = () => {
  axios.delete(`/api/warehouse-request/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('warehouseRequest.deleteSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('warehouseRequest.deleteError'),
        life: 3000
      })
    })
}

const acceptRequest = () => {
  axios.post(`/api/warehouse-request/accept/${accept_id.value}`)
    .then(() => {
      fetchData()
      acceptDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('warehouseRequest.acceptSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('warehouseRequest.acceptError'),
        life: 3000
      })
    })
}

const rejectRequest = () => {
  if (!rejected_message.value.trim()) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('warehouseRequest.rejectedMessageRequired'),
      life: 3000
    })
    return
  }

  axios.post(`/api/warehouse-request/reject/${reject_id.value}`, {
    rejected_message: rejected_message.value
  })
    .then(() => {
      fetchData()
      rejectDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('warehouseRequest.rejectSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('warehouseRequest.rejectError'),
        life: 3000
      })
    })
}

const showDetails = (id) => {
  router.push({ name: 'warehouse_request_show', params: { id: id } })
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
  axios.get("/api/warehouse-request", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    warehouseRequests.value = res.data.data
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('warehouseRequest.loadError'),
      life: 3000
    })
    console.error("Error fetching data:", error)
  })
}

watch(searchQuery, (newVal) => {
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
  router.push({ name: 'warehouse-request-create' })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('warehouseRequest.title') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('warehouseRequest.search')" />
              </span>
              <Button
                :label="t('warehouseRequest.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                :label="t('warehouseRequest.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="openNew"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="warehouseRequests"
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
            v-can="'list warehouse requests'"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="number" :header="t('warehouseRequest.number')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.number }}
              </template>
            </Column>

            <Column field="name" :header="t('warehouseRequest.name')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>

            <Column field="email" :header="t('warehouseRequest.email')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.email }}
              </template>
            </Column>

            <Column field="address" :header="t('warehouseRequest.address')" :sortable="true" header-style="width:20%; min-width:15rem;">
              <template #body="slotProps">
                {{ slotProps.data.address }}
              </template>
            </Column>

            <Column field="status_description" :header="t('warehouseRequest.status')" :sortable="true" header-style="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status_description"
                  :severity="{
                    'active': 'success',
                    'pending': 'warning',
                    'rejected': 'danger'
                  }[slotProps.data.status_description] || 'danger'"
                />
              </template>
            </Column>

            <Column :header="t('actions')" header-style="min-width:15rem;">
              <template #body="slotProps">
                <Button

                  icon="pi pi-eye"
                  class="mr-2 p-detail"
                  @click="showDetails(slotProps.data.id)"
                  v-tooltip.top="t('view')"
                />
                <Button
                  v-can="'accept warehouse requests'"
                  icon="pi pi-check"
                  class="mr-2 p-show"
                  @click="confirmAccept(slotProps.data.id)"
                  v-tooltip.top="t('accept')"
                  :disabled="slotProps.data.status_description != 'pending'"
                />
                <Button
                  v-can="'reject warehouse requests'"
                  icon="pi pi-times"
                  class="mr-2 p-delete"
                  @click="confirmReject(slotProps.data.id)"
                  v-tooltip.top="t('reject')"
                  :disabled="slotProps.data.status_description != 'pendding'"
                />

              </template>
            </Column>

            <template #empty>
              <div class="py-4 text-center">
                <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                <p class="text-xl">{{ t('warehouseRequest.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex py-4 justify-content-center align-items-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="mt-3 p-paginator p-component p-unselectable-text" v-if="totalPages > 0">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ t('showing') }} {{ from }} {{ t('to') }} {{ to }} {{ t('of') }} {{ totalRecords }} {{ t('entries') }}
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
                  @change="changeRowsPerPage"
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
          :header="t('warehouseRequest.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('warehouseRequest.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteRequest"
            />
          </template>
        </Dialog>

        <!-- Accept Confirmation Dialog -->
        <Dialog
          v-model:visible="acceptDialog"
          :style="{ width: '450px' }"
          :header="t('warehouseRequest.acceptConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-check-circle" style="font-size: 2rem; color: var(--green-500)" />
            <span>{{ t('warehouseRequest.acceptConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="acceptDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="acceptRequest"
            />
          </template>
        </Dialog>

        <!-- Reject Confirmation Dialog -->
        <Dialog
          v-model:visible="rejectDialog"
          :style="{ width: '450px' }"
          :header="t('warehouseRequest.rejectConfirmTitle')"
          :modal="true"
        >
          <div class="gap-3 ">
            <div class="flex align-items-center">
              <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
              <span>{{ t('warehouseRequest.rejectConfirmMessage') }}</span>
            </div>
            <div class="gap-2 flex-column">
              <p for="rejectedMessage">{{ t('warehouseRequest.rejectedMessage') }}</p>
              <Textarea
                v-model="rejected_message"
                id="rejectedMessage"
                rows="4"
                class="w-full mt-4"
                :placeholder="t('warehouseRequest.rejectedMessagePlaceholder')"
              />
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="rejectDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="rejectRequest"
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
