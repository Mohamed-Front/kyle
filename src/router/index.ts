

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
        name: 'registration',
        path: 'registration',
        component: () => import('../pages/admin/registration/index.vue'),
      },

       {
        name: 'registration-show',
        path: 'registration-show/:id',
        component: () => import('../pages/admin/registration/show.vue'),
      },
       {
        name: 'home-banner',
        path: 'home-banner',
        component: () => import('../pages/admin/homebanner/index.vue'),
      },
         {
        name: 'banner-edit',
        path: 'banner-edit/:id',
        component: () => import('../pages/admin/homebanner/edit.vue'),
      },
        {
        name: 'banner-create',
        path: 'banner-create',
        component: () => import('../pages/admin/homebanner/create.vue'),
      },

     {
        name: 'products',
        path: 'products',
        component: () => import('../pages/admin/products/index.vue'),
      },
       {
        name: 'products-create',
        path: 'products-create',
        component: () => import('../pages/admin/products/create.vue'),
      }, {
        name: 'products-edit',
        path: 'products-edit/:id',
        component: () => import('../pages/admin/products/edit.vue'),
      },
       {
        name: 'games',
        path: 'games',
        component: () => import('../pages/admin/games/index.vue'),
      },
       {
        name: 'games-create',
        path: 'games-create',
        component: () => import('../pages/admin/games/create.vue'),
      }, {
        name: 'games-edit',
        path: 'games-edit/:id',
        component: () => import('../pages/admin/games/edit.vue'),
      },
       {
        name: 'team',
        path: 'team',
        component: () => import('../pages/admin/team/index.vue'),
      },
       {
        name: 'team-create',
        path: 'team-create',
        component: () => import('../pages/admin/team/create.vue'),
      }, {
        name: 'team-edit',
        path: 'team-edit/:id',
        component: () => import('../pages/admin/team/edit.vue'),
      },
       {
        name: 'post',
        path: 'post',
        component: () => import('../pages/admin/post/index.vue'),
      },
       {
        name: 'post-create',
        path: 'post-create',
        component: () => import('../pages/admin/post/create.vue'),
      }, {
        name: 'post-edit',
        path: 'post-edit/:id',
        component: () => import('../pages/admin/post/edit.vue'),
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
