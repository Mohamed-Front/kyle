<template>
  <div class="bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8 text-right">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">لوحة التحكم</h1>
      <p class="text-lg text-gray-600">مرحباً، هنا نظرة عامة على إحصائيات النظام</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <!-- Users Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">إجمالي المستخدمين</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.users_count }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +5%
              </span>
              <span class="text-gray-500 mr-2">من الشهر الماضي</span>
            </p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Contact Requests Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">طلبات التواصل</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.contactUs_count }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12%
              </span>
              <span class="text-gray-500 mr-2">من الشهر الماضي</span>
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Complaints Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-orange-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">إجمالي الشكاوى</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.complaints_count }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-red-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                -2%
              </span>
              <span class="text-gray-500 mr-2">من الشهر الماضي</span>
            </p>
          </div>
          <div class="bg-orange-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Roles Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 border-r-4 border-purple-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">أدوار المستخدمين</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ data.roles_count }}</h3>
            <p class="text-sm mt-3 flex items-center">
              <span class="text-green-500 font-medium flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +0%
              </span>
              <span class="text-gray-500 mr-2">من الشهر الماضي</span>
            </p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Complaints Trend Chart -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">اتجاه الشكاوى</h2>
          <div class="flex space-x-2 bg-gray-100 rounded-lg">
            <button
              v-for="year in ['2023', '2022']"
              :key="year"
              @click="selectedYear = year"
              :class="['px-4 py-1 text-sm rounded-md', selectedYear === year ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-50']"
            >
              {{ year }}
            </button>
          </div>
        </div>
        <div class="relative h-64">
          <canvas ref="complaintsChart"></canvas>
        </div>
      </div>

      <!-- Request Types Chart -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">أنواع الطلبات</h2>
        <div class="relative ">
          <canvas ref="requestTypesChart"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <div v-for="(type, index) in requestTypes" :key="type.name" class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2" :style="`background-color: ${typeColors[index]}`"></div>
            <span class="text-sm text-gray-600">{{ type.name }}</span>
            <span class="text-sm font-medium text-gray-800 mr-auto">{{ type.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800">النشاط الأخير</h2>
        </div>
        <div class="overflow-y-auto ">
          <div v-for="(activity, index) in recentActivities" :key="index" class="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div class="flex items-start">
              <div :class="`p-3 rounded-lg ${activity.iconBg} ${activity.iconText} ml-4`">
                <svg :class="`w-6 h-6`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path :stroke-linecap="activity.iconLinecap" :stroke-linejoin="activity.iconLinejoin" :stroke-width="activity.iconWidth" :d="activity.iconPath" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="text-base font-medium text-gray-800">{{ activity.title }}</h3>
                  <span class="text-xs text-gray-500">{{ activity.time }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                <div v-if="activity.status" class="mt-2">
                  <span :class="`px-2 py-1 text-xs font-medium rounded-full ${activity.statusClass}`">
                    {{ activity.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Summary -->
      <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">الملخص الشهري</h2>
        <div class="relative ">
          <canvas ref="monthlySummaryChart"></canvas>
        </div>
        <div class="mt-6 grid grid-cols-3 gap-4">
          <div v-for="stat in monthlyStats" :key="stat.name" class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">{{ stat.name }}</p>
            <h3 class="text-xl font-bold text-gray-800 mt-1">{{ stat.value }}</h3>
            <p class="text-xs mt-2 flex items-center">
              <span :class="`font-medium ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`">
                <svg class="h-3 w-3 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.trend > 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'" />
                </svg>
                {{ Math.abs(stat.trend) }}%
              </span>
              <span class="text-gray-500 mr-2">من الشهر الماضي</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
Chart.register(...registerables);

// Refs for chart instances
const complaintsChart = ref<HTMLCanvasElement | null>(null);
const requestTypesChart = ref<HTMLCanvasElement | null>(null);
const monthlySummaryChart = ref<HTMLCanvasElement | null>(null);

// Data state
const data = ref({
  users_count: 0,
  contactUs_count: 0,
  complaints_count: 0,
  roles_count: 0,
  last_complaints: {}
});

const selectedYear = ref('2023');

// Sample data for recent activities
const recentActivities = ref([
  {
    title: 'مستخدم جديد',
    description: 'سارة أحمد قامت بإنشاء حساب جديد',
    time: 'قبل 10 دقائق',
    status: 'نشط',
    statusClass: 'bg-green-100 text-green-800',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    iconLinecap: 'round',
    iconLinejoin: 'round',
    iconWidth: '2'
  },
  {
    title: 'طلب تواصل',
    description: 'استفسار حول خدمات النظام',
    time: 'قبل 25 دقيقة',
    status: 'قيد الانتظار',
    statusClass: 'bg-blue-100 text-blue-800',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconLinecap: 'round',
    iconLinejoin: 'round',
    iconWidth: '2'
  },
  {
    title: 'شكوى تم حلها',
    description: 'تم حل مشكلة تتعلق بالخدمة',
    time: 'قبل ساعة',
    status: 'مكتمل',
    statusClass: 'bg-purple-100 text-purple-800',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconLinecap: 'round',
    iconLinejoin: 'round',
    iconWidth: '2'
  },
  {
    title: 'إضافة خدمة جديدة',
    description: 'تمت إضافة خدمة جديدة للنظام',
    time: 'قبل ساعتين',
    status: '',
    statusClass: '',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    iconLinecap: 'round',
    iconLinejoin: 'round',
    iconWidth: '2'
  },
  {
    title: 'صيانة النظام',
    description: 'تمت الصيانة المجدولة بنجاح',
    time: 'قبل 5 ساعات',
    status: '',
    statusClass: '',
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconLinecap: 'round',
    iconLinejoin: 'round',
    iconWidth: '2'
  }
]);

// Request types data
const requestTypes = ref([
  { name: 'طلبات الخدمة', value: 40 },
  { name: 'استفسارات عامة', value: 30 },
  { name: 'مشكلات تقنية', value: 15 },
  { name: 'طلبات دعم', value: 10 },
  { name: 'أخرى', value: 5 }
]);

const typeColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Monthly stats
const monthlyStats = ref([
  { name: 'مستخدمون جدد', value: '124', trend: 8 },
  { name: 'الطلبات', value: '342', trend: 12 },
  { name: 'الإيرادات', value: '$24,560', trend: 5 }
]);

// Fetch data from API
const fetchData = async () => {
  try {
    const response = await axios.get('api/dashboard/data');
    data.value = response.data.data;

    // Transform complaints data for chart
    const complaintsData = Object.values(data.value.last_complaints);
    const complaintsLabels = Object.keys(data.value.last_complaints);

    if (complaintsChart.value) {
      new Chart(complaintsChart.value, {
        type: 'line',
        data: {
          labels: complaintsLabels,
          datasets: [
            {
              label: 'الشكاوى',
              data: complaintsData,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#3B82F6',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1F2937',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12,
              cornerRadius: 8,
              displayColors: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                padding: 12
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                padding: 12
              }
            },
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    }
  } catch (error) {
    console.error('خطأ في جلب بيانات لوحة التحكم:', error);
  }
};

// Initialize charts
onMounted(() => {
  fetchData();

  // Request Types Chart
  if (requestTypesChart.value) {
    new Chart(requestTypesChart.value, {
      type: 'doughnut',
      data: {
        labels: requestTypes.value.map(type => type.name),
        datasets: [
          {
            data: requestTypes.value.map(type => type.value),
            backgroundColor: typeColors,
            borderWidth: 0,
            borderRadius: 4,
            spacing: 2
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1F2937',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
        cutout: '75%'
      },
    });
  }

  // Monthly Summary Chart
  if (monthlySummaryChart.value) {
    new Chart(monthlySummaryChart.value, {
      type: 'bar',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        datasets: [
          {
            label: 'المستخدمون',
            data: [80, 95, 110, 100, 120, 130, 140, 135, 125, 115, 105, 95],
            backgroundColor: '#3B82F6',
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'الطلبات',
            data: [200, 220, 240, 230, 250, 270, 290, 280, 260, 240, 220, 200],
            backgroundColor: '#10B981',
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'الإيرادات',
            data: [15000, 16000, 17000, 16500, 18000, 19000, 20000, 19500, 18500, 17500, 16500, 15500],
            backgroundColor: '#F59E0B',
            borderRadius: 6,
            borderSkipped: false
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#1F2937',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              padding: 12,
              callback: function(value) {
                if (typeof value === 'number') {
                  return value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : value;
                }
                return value;
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              padding: 12
            }
          },
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    });
  }
});
</script>

<style scoped>
/* Custom scrollbar for activity feed */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: rgba(156, 163, 175, 0.1);
}

/* Animation for cards */
.card-enter-active,
.card-leave-active {
  transition: all 0.4s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* RTL adjustments */
.text-right {
  text-align: right;
}
</style>
