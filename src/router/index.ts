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
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.needAuth)) {
    if (!store.state.login.loggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
      if (to.matched.some(r => r.meta.needAdmin)) {
        if (!store.state.login.isAdmin) {
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
    if (store.state.login.loggedIn) {
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
