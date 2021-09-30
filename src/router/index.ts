import store from '@/store'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      needAuth: false,
      needAdmin: false,
      redirIfAuth: false
    }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import(/* webpackChunkName: "order" */ '../views/Services.vue'),
    meta: {
      needAuth: false,
      needAdmin: false,
      redirIfAuth: false
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import(/* webpackChunkName: "order" */ '../views/Cart.vue'),
    meta: {
      needAuth: false,
      needAdmin: false,
      redirIfAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "order" */ '../views/Login.vue'),
    meta: {
      needAuth: false,
      needAdmin: false,
      redirIfAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "order" */ '../views/Register.vue'),
    meta: {
      needAuth: false,
      needAdmin: false,
      redirIfAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "order" */ '../views/Dashboard.vue'),
    meta: {
      needAuth: true,
      needAdmin: false,
      redirIfAuth: false
    }
  },
  {
    path: `/admin/category`,
    name: `CategoryAdmin`,
    component: () => import(/* webpackChunkName: "admin" */ `../views/admin/AddCategory.vue`),
    meta: {
      needAuth: true,
      needAdmin: true,
      redirIfAuth: false
    },
  },
  {
    path: `/verifyEmail`,
    name: `VerifyEmail`,
    component: () => import(/* webpackChunkName: "order" */ `../views/VerifyEmail.vue`),
    meta: {
      needAuth: false,
      needAdmin: false,
      redirIfAuth: true
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.needAuth)) {
    if (!store.getters[`auth/isLoggedIn`]) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
      if (to.matched.some(r => r.meta.needAdmin)) {
        if (!store.getters[`auth/isAdmin`]) {
          next({
            path: '/dashboard',
            query: { redirect: to.fullPath }
          })
        } else {
          next()
        }
      }
    }
  } else if (to.matched.some(r => r.meta.redirIfAuth)) {
    if (store.getters[`auth/isLoggedIn`]) {
      next({
        path: '/dashboard',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
