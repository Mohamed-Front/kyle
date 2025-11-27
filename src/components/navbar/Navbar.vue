<template>
  <div>
    <!-- Navbar -->
    <va-navbar
      class="nave flex justify-between shadow-xl my-3 rounded-xl"
      style="color: white !important; direction: ltr !important;"
      :class="{ 'fixed-nav': isScrolled }"
    >
      <template #right>
        <div class="left">
          <h1>{{ translatedRouteName }}</h1>
        </div>
      </template>
      <template #left>
        <div class="right flex items-center gap-4">
          <va-icon-menu-collapsed
            :class="{ 'x-flip': isSidebarMinimized }"
            class="va-navbar__item"
            :color="colors.primary"
            @click="isSidebarMinimized = !isSidebarMinimized"
          />
          <!-- Go to Website Button -->
          <Button
            @click="goToWebsite"
            icon="pi pi-globe"
            label="الذهاب للموقع"

          ></Button>
          <!-- Logout Button -->
          <Button
            @click="handleLogout"
            icon="pi pi-sign-out"
            class="logout-btn"
          ></Button>
        </div>
      </template>
    </va-navbar>


  </div>
</template>

<script setup>
import { computed, ref,onUnmounted  } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../../stores/global-store'
import { useAuthStore } from '../../stores/Auth'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import VaIconMenuCollapsed from '../icons/VaIconMenuCollapsed.vue'
import Button from 'primevue/button' // Assuming PrimeVue is used for buttons

const { t } = useI18n()
const router = useRouter()
const GlobalStore = useGlobalStore()
const authStore = useAuthStore()
const { isSidebarMinimized, userName } = storeToRefs(GlobalStore)
const { getColors } = useColors()
const colors = computed(() => getColors())

// State to track scroll position
const isScrolled = ref(false)

// Handle scroll event to toggle fixed navbar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50 // Adjust threshold as needed
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll)

// Cleanup event listener on component unmount
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Handle logout
const handleLogout = () => {
  authStore.handleLogout()
}

// Navigate to website
const goToWebsite = () => {
  router.push({name:'home'})
}

// Computed property to reactively track route name changes and translate
const translatedRouteName = computed(() => {
  return router.currentRoute.value.name ? t(router.currentRoute.value.name) : ''
});
</script>

<style lang="scss" scoped>
.va-navbar {
  box-shadow: var(--va-box-shadow);
  z-index: 2;
  background-color: #ffffff !important;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.x-flip {
  transform: scaleX(-100%);
}

.website-btn,
.logout-btn {
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.website-btn {
  background-color: var(--va-primary);
  color: white;
}

.content {
  margin-top: 80px; /* Adjust based on navbar height to prevent content overlap */
  padding: 1rem;
}

@media screen and (max-width: 768px) {
  .va-navbar {
    padding: 0.5rem;
  }

  .right {
    gap: 0.5rem;
  }

  .website-btn,
  .logout-btn {
    padding: 0.35rem;
  }

  .content {
    margin-top: 60px; /* Adjust for smaller screens */
  }
}
</style>
