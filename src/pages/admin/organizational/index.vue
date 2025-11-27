<template>
  <div class="organization-page">
    <Toast />

    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <h1>الهيكل التنظيمي</h1>
        </template>
        <template #end>
          <Button label="تحديث" icon="pi pi-refresh" class="p-button-info mr-2" @click="fetchData" />
        </template>
      </Toolbar>

      <OrganizationChart :value="data" v-if="data">
        <template #country="slotProps">
          <div class="flex flex-column">
            <img :alt="slotProps.node.title" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                 :class="`w-2rem flag flag-${slotProps.node.data}`" />
            <div class="mt-3 font-medium text-lg">{{ slotProps.node.title }}</div>
          </div>
        </template>
        <template #default="slotProps">
          <div class="node-card" @click="openEditDialog(slotProps.node)">
            <div class="node-title">{{ slotProps.node.name }}</div>
            <div class="node-name pt-1">{{ slotProps.node.title }}</div>
            <div class="node-actions">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-sm p-detail" @click.stop="openEditDialog(slotProps.node)" />
              <Button icon="pi pi-plus" class="p-button-rounded p-button-sm p-detail" @click.stop="openAddDialog(slotProps.node)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-sm p-delete"
                      @click.stop="confirmDelete(slotProps.node)" v-if="slotProps.node.parent_id !== null" />
            </div>
          </div>
        </template>
      </OrganizationChart>
    </div>

    <!-- نافذة تعديل الموظف -->
    <Dialog v-model:visible="editDialogVisible" header="تعديل بيانات الموظف" :modal="true" class="p-fluid" style="width: 450px">
      <div class="field">
        <label for="name">الاسم</label>
        <InputText id="name" v-model="selectedNode.name" required autofocus />
      </div>
      <div class="field">
        <label for="title">المنصب</label>
        <InputText id="title" v-model="selectedNode.title" required />
      </div>
      <div class="field" v-if="selectedNode.parent_id !== null">
        <label for="parent">المدير المباشر</label>
        <Dropdown v-model="selectedNode.parent_id" :options="parentOptions" optionLabel="title"
                  optionValue="id" placeholder="اختر المدير" />
      </div>
      <template #footer>
        <Button label="إلغاء" icon="pi pi-times" class="p-button-text" @click="editDialogVisible = false" />
        <Button label="حفظ" icon="pi pi-check" class="p-button-text" @click="saveChanges" />
      </template>
    </Dialog>

    <!-- نافذة إضافة موظف -->
    <Dialog v-model:visible="addDialogVisible" header="إضافة موظف جديد" :modal="true" class="p-fluid" style="width: 450px;">
      <div class="field">
        <label for="newName">الاسم</label>
        <InputText id="newName" v-model="newNode.name" required autofocus />
      </div>

<div class="field">
        <label for="newTitle">المنصب</label>
        <InputText id="newTitle" v-model="newNode.title" required />
      </div>

<div class="field">
        <label for="parent">المدير المباشر</label>
        <Dropdown v-model="newNode.parent_id" :options="parentOptions" optionLabel="title"
                  optionValue="id" placeholder="اختر المدير" />
      </div>

<template #footer>
        <Button label="إلغاء" icon="pi pi-times" class="p-button-text" @click="addDialogVisible = false" />
        <Button label="حفظ" icon="pi pi-check" class="p-button-text" @click="addEmployee" />
      </template>
    </Dialog>

    <!-- نافذة تأكيد الحذف -->
    <Dialog v-model:visible="deleteDialogVisible" header="تأكيد الحذف" :modal="true" style="width: 350px">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>هل أنت متأكد من حذف <b>{{ selectedNode?.title }}</b>؟</span>
      </div>
      <template #footer>
        <Button label="لا" icon="pi pi-times" class="p-button-text" @click="deleteDialogVisible = false" />
        <Button label="نعم" icon="pi pi-check" class="p-button-text" @click="deleteEmployee" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const data = ref(null);
const editDialogVisible = ref(false);
const addDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const selectedNode = ref({});
const newNode = ref({
  name: '',
  title: '',
  parent_id: null
});

// خيارات الأبوين المحتملين
const parentOptions = computed(() => {
  if (!data.value) return [];

  const flattenNodes = (node) => {
    let nodes = [node];
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        nodes = nodes.concat(flattenNodes(child));
      });
    }
    return nodes;
  };

  const allNodes = flattenNodes(data.value);
  return allNodes.filter(node => node.id !== selectedNode.value?.id);
});

const fetchData = () => {
  axios.get('api/organizational-structure')
    .then((res) => {
      data.value = res.data.data[0];
      toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحميل البيانات بنجاح', life: 3000 });
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تحميل البيانات', life: 3000 });
      console.error("خطأ في جلب البيانات:", error);
    });
};

const openEditDialog = (node) => {
  selectedNode.value = { ...node };
  editDialogVisible.value = true;
};

const openAddDialog = (parentNode) => {
  newNode.value = {
    name: '',
    title: '',
    parent_id: parentNode.id
  };
  addDialogVisible.value = true;
};

const saveChanges = () => {
  axios.put(`api/organizational-structure/${selectedNode.value.id}`, {
    name: selectedNode.value.name,
    title: selectedNode.value.title,
    parent_id: selectedNode.value.parent_id
  })
  .then(() => {
    toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم حفظ التغييرات بنجاح', life: 3000 });
    fetchData();
    editDialogVisible.value = false;
  })
  .catch((error) => {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في حفظ التغييرات', life: 3000 });
    console.error("خطأ في حفظ التغييرات:", error);
  });
};

const addEmployee = () => {
  axios.post('api/organizational-structure', newNode.value)
    .then(() => {
      toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم إضافة الموظف بنجاح', life: 3000 });
      fetchData();
      addDialogVisible.value = false;
      newNode.value = { name: '', title: '', parent_id: null };
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في إضافة الموظف', life: 3000 });
      console.error("خطأ في إضافة الموظف:", error);
    });
};

const confirmDelete = (node) => {
  selectedNode.value = { ...node };
  deleteDialogVisible.value = true;
};

const deleteEmployee = () => {
  axios.delete(`api/organizational-structure/${selectedNode.value.id}`)
    .then(() => {
      toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم حذف الموظف بنجاح', life: 3000 });
      fetchData();
      deleteDialogVisible.value = false;
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في حذف الموظف', life: 3000 });
      console.error("خطأ في حذف الموظف:", error);
    });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.organization-page {
  padding: 0rem;
}

.org-chart {
  width: 100%;
}

.node-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 5px;
  margin: 0rem;
  min-width: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.node-title {
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
}

.node-name {
  font-size: 0.9rem;
  color: #718096;
  margin-top: 0.25rem;
}

.node-actions {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0.3rem;
}

.p-organizationchart .p-organizationchart-node-content {
  padding: 0px !important;
}

.p-organizationchart-node-content {
  padding: 0 !important;
  border: none !important;
}

.confirmation-content {
  display: flex;
  align-items: center;
}
</style>

<style>
.p-organizationchart-table > tbody > tr > td {
  text-align: center !important;
}

.p-toolbar {
  width: 100% !important;
}

.p-organizationchart .p-organizationchart-line-top {
  border: 0px;
}

.p-organizationchart .p-organizationchart-line-down {
  background-color: aliceblue !important;
}

.p-organizationchart .p-organizationchart-node-content {
  padding: 0px !important;
  border-radius: 25px !important;
}
</style>
