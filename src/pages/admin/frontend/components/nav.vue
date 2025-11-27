<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center">
            <img
              src="../../../../assets/logo.png"
              alt="PrimeVue Logo"
              class="h-10 w-auto"
            />
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <Menubar :model="menuItems" class="bg-transparent border-none">
            <template #start>
              <!-- Empty to align with Tailwind styling -->
            </template>
            <template #item="{ item, props, hasSubmenu }">
              <div
                class="relative"
                @mouseenter="openSubmenu(item)"
                @mouseleave="closeSubmenu(item)"
              >
                <router-link
                  v-if="item.route"
                  v-slot="{ href, navigate }"
                  :to="item.route"
                  custom
                >
                  <a
                    v-ripple
                    :href="href"
                    @click="navigate"
                    class="text-[#696969] hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                  >
                    <span :class="item.icon" class="mr-2" />
                    <span>{{ item.label }}</span>
                    <span
                      v-if="hasSubmenu"
                      class="pi pi-fw pi-angle-down ml-2"
                    />
                  </a>
                </router-link>
                <a
                  v-else
                  v-ripple
                  :href="item.url"
                  :target="item.target"
                  class="text-[#696969] hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                >
                  <span :class="item.icon" class="mr-2" />
                  <span>{{ item.label }}</span>
                  <span
                    v-if="hasSubmenu"
                    class="pi pi-fw pi-angle-down ml-2"
                  />
                </a>
                <!-- Submenu -->
                <transition name="fade">
                  <div
                    v-if="hasSubmenu && item.showSubmenu"
                    class="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100"
                  >
                    <div
                      v-for="subItem in item.items"
                      :key="subItem.label"
                      class="py-1"
                    >
                      <div
                        v-if="subItem.items"
                        class="px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        {{ subItem.label }}
                      </div>
                      <router-link
                        v-if="subItem.route"
                        :to="subItem.route"
                        class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        @click="closeAllSubmenus"
                      >
                        {{ subItem.label }}
                      </router-link>
                      <router-link
                        v-for="subSubItem in subItem.items"
                        v-else
                        :key="subSubItem.label"
                        :to="subSubItem.route"
                        class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        @click="closeAllSubmenus"
                      >
                        {{ subSubItem.label }}
                      </router-link>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </Menubar>
        </div>

        <!-- Mobile Menu Trigger -->
        <div class="md:hidden flex items-center">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              :class="{ 'block': mobileMenuOpen, 'block': !mobileMenuOpen }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="hidden h-6 w-6"
              :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white shadow-lg"
        id="mobile-menu"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <template v-for="item in menuItems" :key="item.label">
            <!-- Items with direct route -->
            <router-link
              v-if="item.route"
              :to="item.route"
              @click="toggleMobileMenu"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
            >
              <span :class="item.icon" class="mr-2" />
              {{ item.label }}
            </router-link>

            <!-- Items with submenu -->
            <div v-else>
              <button
                @click="toggleMobileSubmenu(item)"
                class="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
              >
                <div>
                  <span :class="item.icon" class="mr-2" />
                  {{ item.label }}
                </div>
                <span
                  class="pi pi-fw pi-angle-down transition-transform duration-200"
                  :class="{ 'transform rotate-180': item.showSubmenu }"
                />
              </button>

              <!-- Submenu items -->
              <div
                v-if="item.showSubmenu"
                class="pl-4 space-y-1 bg-gray-50 rounded-md"
              >
                <template v-for="subItem in item.items" :key="subItem.label">
                  <!-- Subitems with direct route -->
                  <router-link
                    v-if="subItem.route"
                    :to="subItem.route"
                    @click="toggleMobileMenu"
                    class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
                  >
                    {{ subItem.label }}
                  </router-link>

                  <!-- Subitems with nested items -->
                  <template v-else>
                    <div class="pt-2">
                      <div class="px-3 py-1 text-sm font-semibold text-gray-500">
                        {{ subItem.label }}
                      </div>
                      <router-link
                        v-for="subSubItem in subItem.items"
                        :key="subSubItem.label"
                        :to="subSubItem.route"
                        @click="toggleMobileMenu"
                        class="block px-6 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
                      >
                        {{ subSubItem.label }}
                      </router-link>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Menubar from 'primevue/menubar';
import 'primeicons/primeicons.css';

// Menu items for the navbar
const menuItems = ref([
  {
    label: 'بوابة الإدارة الداخلية',
    route: '/admin/dashboard',
    icon: 'pi pi-home',
    showSubmenu: false,
  },
  {
    label: ' الشكاوي',
    route: '/complaint',
    icon: 'pi pi-envelope',
    showSubmenu: false,
  },
  {
    label: 'منطقة التل',
    icon: 'pi pi-angle-down',
    showSubmenu: false,
    items: [
      {
        label: 'عن المنطقة',
        items: [
          { label: 'الهيكل التنظيمي', route: '/organizational-front' },
          { label: 'الهيكل الإداري', route: '/administrative-structure' },
        ],
      },
      {
        label: 'قيادة المنطقة',
        items: [
          { label: 'كلمة رئيس المنطقة', route: '/not-available' },
          { label: 'تواصل مع رئيس المنطقة', route: '/not-available' },
        ],
      },
    ],
  },
  {
    label: 'روابط تهمك',
    icon: 'pi pi-angle-down',
    showSubmenu: false,
    items: [
      {
        label: 'لجنة التنمية في مدينة التل',
        route: '/not-available'
      },
      {
        label: 'لجنة التنمية في مدينة التل',
        route: '/not-available'
      },
      {
        label: 'لجنة التنمية في مدينة التل',
        route: '/not-available'
      },
    ],
  },
  {
    label: 'الخدمات',
    icon: 'pi pi-angle-down',
    showSubmenu: false,
    items: [
      {
        label: 'الشكاوي',
        route: '/complaint'
      },
      {
        label: 'الخريطه',
        route: '/map'
      },
      {
        label: 'المشاريع الاستثمارية',
        route: '/not-available'
      },
      {
        label: 'الرخص',
        route: '/not-available'
      },
      {
        label: 'خدمة',
        route: '/not-available'
      },
    ],
  },
  {
    label: 'تواصل معنا',
    route: '/about',
    icon: 'pi pi-envelope',
    showSubmenu: false,
  },
]);

const mobileMenuOpen = ref(false);

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  // Close all submenus when closing mobile menu
  if (!mobileMenuOpen.value) {
    closeAllSubmenus();
  }
};

// Toggle mobile submenu
const toggleMobileSubmenu = (item) => {
  if (item.items) {
    item.showSubmenu = !item.showSubmenu;
    // Close other submenus
    menuItems.value.forEach(menuItem => {
      if (menuItem !== item) {
        menuItem.showSubmenu = false;
      }
    });
  }
};

// Open submenu on hover (desktop)
const openSubmenu = (item) => {
  if (item.items) {
    menuItems.value.forEach((menuItem) => {
      menuItem.showSubmenu = menuItem === item;
    });
  }
};

// Close submenu
const closeSubmenu = (item) => {
  if (item.items) {
    item.showSubmenu = false;
  }
};

// Close all submenus
const closeAllSubmenus = () => {
  menuItems.value.forEach((item) => {
    item.showSubmenu = false;
  });
};

// Handle click outside to close submenus
const handleClickOutside = (event) => {
  const navbar = document.querySelector('nav');
  if (navbar && !navbar.contains(event.target)) {
    closeAllSubmenus();
  }
};

// Close menu when clicking on a router link
const handleRouteChange = () => {
  mobileMenuOpen.value = false;
  closeAllSubmenus();
};

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

// Close mobile menu on larger screens
const handleResize = () => {
  if (window.innerWidth >= 768) {
    mobileMenuOpen.value = false;
    closeAllSubmenus();
  }
};
</script>

<style scoped>
/* Custom Tailwind styles for PrimeVue components */
.p-menubar {
  @apply bg-transparent border-none;
}

.p-menubar .p-menuitem-link {
  @apply text-[#696969] hover:bg-gray-100 hover:text-primary px-3 py-2 rounded-md text-sm font-medium;
}

/* Fade transition for submenu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom primary color */
.hover\:text-primary:hover {
  color: #3b82f6; /* You can change this to your preferred primary color */
}
</style>
