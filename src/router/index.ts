

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'
import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },

   {
    name: 'home',
    path: '/',
    component: () => import('../pages/admin/frontend/pages/home.vue'),
  },
  {
    name: 'map',
    path: '/map',
    component: () => import('../pages/admin/frontend/pages/map.vue'),
  },
   {
    name: 'organizational-front',
    path: '/organizational-front',
    component: () => import('../pages/admin/frontend/pages/organizational.vue'),
  },
  {
    name: 'complaint',
    path: '/complaint',
    component: () => import('../pages/admin/frontend/pages/Complaint.vue'),
  },
    {
    name: 'administrative-structure',
    path: '/administrative-structure',
    component: () => import('../pages/admin/frontend/pages/administrative-structure.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('../pages/admin/frontend/pages/about-us.vue'),
  },
   {
    name: 'not-available',
    path: '/not-available',
    component: () => import('../pages/admin/frontend/pages/not-available.vue'),
  },
  {
    name: 'not-found-advanced',
    path: '/404',
    component: Page404Layout,
    children: [
      {
        name: 'not-found-advanced',
        path: 'not-found-advanced',
        component: () => import('../pages/404-pages/VaPageNotFound.vue'),
      },
    ],
  },

  // Auth routes (accessible to all)
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    beforeEnter: auth, // Adding auth guard as in the previous code
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'roles',
        path: 'roles',
        component: () => import('../pages/admin/roles/index.vue'),
      },
      {
        name: 'roles-update',
        path: 'roles-update/:id',
        component: () => import('../pages/admin/roles/update.vue'),
      },
      {
        name: 'roles-create',
        path: 'roles-create',
        component: () => import('../pages/admin/roles/create.vue'),
      },
      {
        name: 'Permission',
        path: 'Permission',
        component: () => import('../pages/admin/Permissions/index.vue'),
      },
      {
        name: 'statistics',
        path: 'users_management',
        children: [
          {
            name: 'users',
            path: 'users',
            component: () => import('../pages/admin/users/users.vue'),
          },
          {
            name: 'Complaint',
            path: 'complaint',
            component: () => import('../pages/admin/complaint/index.vue'),
          },
          {
            name: 'complaint_show',
            path: 'complaint-show/:id',
            component: () => import('../pages/admin/complaint/show.vue'),
          },
          {
            name: 'warehouse_request',
            path: 'warehouse-request',
            component: () => import('../pages/admin/warehouse-request/index.vue'),
          },
          {
            name: 'warehouse_request_show',
            path: 'warehouse_request_show/:id',
            component: () => import('../pages/admin/warehouse-request/show.vue'),
          },
          {
            name: 'user-edit',
            path: 'user-edite/:id',
            component: () => import('../pages/admin/users/edite.vue'),
          },
          {
            name: 'user-create',
            path: 'user-create',
            component: () => import('../pages/admin/users/create.vue'),
          },
        ],
      },
      {
        name: 'settings',
        path: 'settings',
        children: [

           {
            name: 'setting',
            path: 'setting',
            component: () => import('../pages/admin/settings/update.vue'),
          },
          {
            name: 'contact-us',
            path: 'contact-us',
            component: () => import('../pages/admin/contact-us/index.vue'),
          },
             {
            name: 'entities',
            path: 'entities',
            component: () => import('../pages/admin/entities/index.vue'),
          },
          {
            name: 'organizational',
            path: 'organizational',
            component: () => import('../pages/admin/organizational/index.vue'),
          },
        ],
      },
      UIRoute,
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'register-storehouse',
        path: 'register-storehouse',
        component: () => import('../pages/auth/signup/register-storehouse.vue'),
      },
      {
        name: 'register-pharmacy',
        path: 'register-pharmacy',
        component: () => import('../pages/auth/signup/register-pharmacy.vue'),
      },
      {
        name: 'inquiry',
        path: 'inquiry',
        component: () => import('../pages/auth/login/inquiry.vue'),
      },
      {
        name: 'inquiry-warehous',
        path: 'inquiry-warehous/:id',
        component: () => import('../pages/auth/login/inquiry-warehous.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

function auth(to: any, from: any, next: any) {
  if (localStorage.getItem('token')) {
    next()
  } else {
    next({ name: 'login' }) // Redirect to login if no token
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // Ensure the scroll happens and return the position
    const element = document.querySelector('.app-layout__page')
    if (element) {
      element.scrollTo(0, 0)
    }
    return { top: 0, left: 0 }
  },
  routes,
})

export default router
