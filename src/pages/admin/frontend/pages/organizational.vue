<template>
  <Nav />

  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8 w-full">
      <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
        الهيكل التنظيمي – إدارة منطقة التل
      </h1>
    </div>

    <!-- Content -->
    <div class="w-full max-w-6xl overflow-x-auto bg-white rounded-2xl shadow p-4">
      <OrganizationChart
        v-if="data"
        :value="data"
        class="fancy-chart"
        style="min-width: 600px"
      >
        <template #country="slotProps">
          <div class="flex flex-col items-center text-center">
            <img
              :alt="slotProps.node.title"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              class="w-12 h-8 shadow-md rounded"
            />
            <div class="mt-2 font-semibold text-white text-lg">
              {{ slotProps.node.title }}
            </div>
          </div>
        </template>

        <template #default="slotProps">
          <div class="node-card">
            <div class="node-title">{{ slotProps.node.title }}</div>
            <div class="node-name">{{ slotProps.node.name }}</div>
            <div class="node-decoration"></div>
          </div>
        </template>
      </OrganizationChart>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Nav from "../components/nav.vue";
import Footer from "../components/footer.vue";

const toast = useToast();
const data = ref(null);

const fetchData = () => {
  axios
    .get("api/organizational-structure/not/auth")
    .then((res) => {
      data.value = res.data.data[0];
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Data loaded successfully",
        life: 3000,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data",
        life: 3000,
      });
      console.error("Error fetching data:", error);
    });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.node-card {
  @apply bg-white border border-gray-200 rounded-xl p-4 min-w-[140px] shadow-sm transition-all relative overflow-hidden text-center;
}
.node-card:hover {
  @apply -translate-y-1 shadow-lg border-blue-500;
}
.node-title {
  @apply font-bold text-base text-gray-800 relative z-10;
}
.node-name {
  @apply mt-4 text-sm text-white bg-green-800 px-3 py-1 rounded-full inline-block relative z-10;
}
.node-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: linear-gradient(90deg, #4f6cea 0%, #3b56d6 100%);
  transition: width 0.3s ease;
}
.node-card:hover .node-decoration {
  width: 100%;
}
.fancy-chart {
  background: transparent;
}
.fancy-chart :deep(.p-organizationchart-node-content) {
  border-radius: 12px !important;
  overflow: hidden;
}
.fancy-chart :deep(.p-organizationchart-line-down) {
  background: linear-gradient(180deg, #c7d2fe 0%, #a5b4fc 100%) !important;
  width: 2px !important;
  margin: 0 auto !important;
}
.fancy-chart :deep(.p-organizationchart-line-left) {
  border-right: 2px solid #a5b4fc !important;
  border-radius: 0 !important;
}
.fancy-chart :deep(.p-organizationchart-line-right) {
  border-left: 2px solid #a5b4fc !important;
  border-radius: 0 !important;
}
</style>

<style>
/* Global (non-scoped) styles for organization chart */
.p-organizationchart-table > tbody > tr > td {
  text-align: center !important;
  border: 1px solid white !important;
}

.p-toolbar {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.p-organizationchart
  .p-organizationchart-line-down,
.p-organizationchart
  .p-organizationchart-line-top,
.p-organizationchart
  .p-organizationchart-line-left,
.p-organizationchart
  .p-organizationchart-line-right {
  visibility: hidden !important;
}

.p-organizationchart .p-organizationchart-node-content {
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
}
</style>
