<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter()
const permissionsData = ref([]);
const loading = ref(true);
const selectedPermissions = ref([]);
const roleName = ref('');
const showDescriptionModal = ref(false);
const currentDescription = ref('');
const tableView = ref(false);

const fetchData = () => {
  axios.get("api/role/all/permissions").then((res) => {
    permissionsData.value = res.data.data;
    loading.value = false;
  });
};

const showDescription = (description) => {
  currentDescription.value = description || 'No description available';
  showDescriptionModal.value = true;
};

const submitSelectedPermissions = () => {
  if (!roleName.value) {
    alert('Please enter a role name');
    return;
  }

  const payload = {
    name: roleName.value,
    permissions: selectedPermissions.value
  };

  axios.post("/api/role", payload)
    .then(response => {
      router.push({name:'roles'})
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-can="'create roles'" class="permission-manager">
    <h1>{{$t("role.role_Permissions_Manager")}}</h1>

    <div class="controls">
      <div class="name-input">
        <label for="roleName">
          {{$t("role.role_Name")}}<span class="required">*</span>
        </label>
        <input
          type="text"
          id="roleName"
          v-model="roleName"
          :placeholder='$t("role.enter_role_name")'
          required
        />
      </div>

      <button
        @click="tableView = !tableView"
        class="view-toggle"
      >
        {{ tableView ? $t('role.switchToCardView') : $t('role.switchToTableView') }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{$t("role.loading.permissions")}}</div>

    <template v-else>
      <!-- Table View -->
      <div v-if="tableView" class="table-view">
        <table>
          <thead>
            <tr>
              <th>{{$t("role.permission")}}</th>
              <th>{{$t("role.description")}}</th>
              <th>{{$t("role.select")}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="permission in permissionsData" :key="permission.id">
              <td>{{ permission.name }}</td>
              <td>
                <button
                  @click="showDescription(permission.description)"
                  class="description-btn"
                  :disabled="!permission.description"
                >
                  {{ permission.description ? $t('role.view') : $t('role.none') }}
                </button>
              </td>
              <td>
                <input
                  type="checkbox"
                  :id="`permission-${permission.id}-table`"
                  :value="permission.id"
                  v-model="selectedPermissions"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card View -->
      <div v-else class="card-view">
        <div class="permission-items">
          <div v-for="permission in permissionsData" :key="permission.id" class="permission-item">
            <div class="permission-info">
              <input
                type="checkbox"
                :id="`permission-${permission.id}`"
                :value="permission.id"
                v-model="selectedPermissions"
              />
              <label :for="`permission-${permission.id}`">
                {{ permission.name }}
              </label>
            </div>
            <button
              @click="showDescription(permission.description)"
              class="description-btn"
              :disabled="!permission.description"
            >
              {{ permission.description ? $t('role.viewDescription') : $t('role.noDescription') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="selection-summary" v-if="selectedPermissions.length > 0">
      <h3>{{$t("role.selectedPermissions")}}</h3>
      <p>{{$t("role.totalSelected")}}: {{ selectedPermissions.length }}</p>
      <div class="id-chips">
        <span v-for="id in selectedPermissions" :key="id" class="id-chip">
          {{ id }}
        </span>
      </div>
    </div>

    <button
      @click="submitSelectedPermissions"
      class="submit-btn"
      :disabled="selectedPermissions.length === 0 || !roleName"
    >
      {{$t("role.createWithPermissions")}}
    </button>

    <!-- Description Modal -->
    <div v-if="showDescriptionModal" class="modal-overlay" @click.self="showDescriptionModal = false">
      <div class="modal-content">
        <h3>{{$t("role.permission_Description")}}</h3>
        <p>{{ currentDescription }}</p>
        <button @click="showDescriptionModal = false" class="close-modal">{{$t("role.close")}}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.permission-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.name-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name-input label {
  font-weight: bold;
  margin-bottom: 4px;
}

.required {
  color: #f44336;
}

.name-input input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 250px;
  font-size: 1em;
}

.view-toggle {
  padding: 8px 16px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-toggle:hover {
  background-color: #3a5a8c;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2em;
}

/* Table View Styles */
.table-view {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

/* Card View Styles */
.permission-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.permission-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.permission-info input {
  transform: scale(1.2);
}

.description-btn {
  padding: 6px 12px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.description-btn:hover:not(:disabled) {
  background-color: #d0d0d0;
}

.description-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Selection Summary */
.selection-summary {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.selection-summary h3 {
  margin-top: 0;
  color: #333;
}

.id-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.id-chip {
  background-color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

/* Submit Button */
.submit-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.close-modal {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-modal:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .permission-items {
    grid-template-columns: 1fr;
  }

  .name-input input {
    min-width: 100%;
  }
}
</style>
