<script setup>
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const loading = ref(true)
const complaint = ref(null)
const selectedStatus = ref(null)
const statusOptions = ref([
  { label: t('complaint.statusOptions.active'), value: 1 },
  { label: t('complaint.statusOptions.inactive'), value: 0 },
  { label: t('complaint.statusOptions.pending'), value: 2 }
])
const procedures = ref([{ procedure: '' }])
const showProcedureForm = ref(true)

const fetchData = () => {
  loading.value = true
  axios.get(`/api/complaint/${route.params.id}`)
    .then((res) => {
      loading.value = false
      complaint.value = res.data.data
       procedures.value=res.data.data.procedures
      selectedStatus.value = res.data.data.status
    })
    .catch((error) => {
      loading.value = false
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('complaint.loadError'),
        life: 3000
      })
      console.error('خطأ في جلب الشكوى:', error)
    })
}

const updateStatus = () => {
  axios.post(`/api/complaint/change/status/${route.params.id}`, { status: selectedStatus.value })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('complaint.updateSuccess'),
        life: 3000
      })
      fetchData()
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('complaint.updateError'),
        life: 3000
      })
      console.error('خطأ في تحديث الحالة:', error)
    })
}

const addProcedureField = () => {
  procedures.value.push({ procedure: '' })
}

const removeProcedureField = (index) => {
  if (procedures.value.length > 1) {
    procedures.value.splice(index, 1)
  }
}

const submitProcedures = () => {
  const payload = {
    procedures: procedures.value.filter(p => p.procedure.trim() !== '')
  }

  if (payload.procedures.length === 0) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('complaint.noProcedures'),
      life: 3000
    })
    return
  }

  axios.post(`/api/complaint/add/procedures/${route.params.id}`, payload)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('complaint.proceduresAdded'),
        life: 3000
      })
      procedures.value = [{ procedure: '' }]
      showProcedureForm.value = true
      fetchData()
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('complaint.proceduresError'),
        life: 3000
      })
      console.error('خطأ في إضافة الإجراءات:', error)
    })
}

const goBack = () => {
  router.push({ name: 'Complaint' })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="grid" dir="rtl">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('complaint.details') }}</h2>
          </template>
          <template #end>
            <Button
              :label="t('complaint.back')"
              icon="pi pi-arrow-right"
              class="p-button-secondary ml-2"
              @click="goBack"
            />
          </template>
        </Toolbar>

        <Toast />

        <div v-if="loading" class="flex justify-content-center align-items-center py-4">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        </div>

        <div v-else-if="complaint" class="card shadow-lg bg-white surface-0 p-4">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.number') }}</label>
                <InputText
                  :value="complaint.number"
                  readonly
                  class="w-full"
                />
              </div>
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.name') }}</label>
                <InputText
                  :value="complaint.name"
                  readonly
                  class="w-full"
                />
              </div>
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.email') }}</label>
                <InputText
                  :value="complaint.email"
                  readonly
                  class="w-full"
                />
              </div>
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.phone') }}</label>
                <InputText
                  :value="complaint.phone"
                  readonly
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.date') }}</label>
                <InputText
                  :value="complaint.date"
                  readonly
                  class="w-full"
                />
              </div>
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.complaint') }}</label>
                <InputText
                  :value="complaint.complaint"
                  readonly
                  class="w-full"
                />
              </div>
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.status') }}</label>
                <Dropdown
                  v-model="selectedStatus"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="t('complaint.selectStatus')"
                  :disabled="selectedStatus === 1"
                  @change="updateStatus"
                />
              </div>
              <div class="field mb-4">
                <label class="font-bold mb-2">{{ t('complaint.notes') }}</label>
                <InputText
                  :value="complaint.notes || '-'"
                  readonly
                  class="w-full"
                />
              </div>
            </div>
          </div>



          <div v-if="showProcedureForm" class="mt-6">
            <h3 class="text-xl font-bold mb-4">{{ t('complaint.addProcedures') }}</h3>
            <div v-for="(procedure, index) in procedures" :key="index" class="field mb-4">
              <div class="flex align-items-center">
                <InputText
                  v-model="procedure.procedure"
                  :placeholder="t('complaint.enterProcedure')"
                  class="w-full ml-2"
                />
                <Button
                  v-if="procedures.length > 1"
                  icon="pi pi-trash"
                  class="p-button-danger p-button-sm"
                  @click="removeProcedureField(index)"
                />
              </div>
            </div>
            <div class="flex justify-content-between">
              <Button
                :label="t('complaint.addAnotherProcedure')"
                icon="pi pi-plus"
                class="mb-4 mx-3"
                @click="addProcedureField"
              />
              <Button
                :label="t('complaint.submitProcedures')"
                icon="pi pi-check"
                class="p-button-primary mb-4"
                @click="submitProcedures"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4">
          <i class="pi pi-exclamation-circle text-2xl mb-2" />
          <p class="text-xl">{{ t('complaint.noData') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;

  label {
    color: var(--text-color);
  }

  :deep(.p-inputtext) {
    background-color: var(--surface-100);
    border: 1px solid var(--surface-border);
    border-radius: 4px;
    color: var(--text-color-secondary);
  }

  :deep(.p-inputtext:read-only) {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

@media screen and (max-width: 960px) {
  .field {
    margin-bottom: 1.5rem;
  }
}
</style>
