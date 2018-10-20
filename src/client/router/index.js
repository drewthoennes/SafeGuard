import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Registration from '@/pages/Registration'

import ErrorPage from '@/pages/Error'

import store from '../store'

Vue.use(Router)

const router = new Router({
  hashbang: false,
  history: true,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Registration',
      component: Registration
    },
    {
      path: '/*',
      name: 'ErrorPage',
      component: ErrorPage
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin) && !store.getters.isAuthenticated) {
    // You can use store variable here to access globalError or commit mutation
    next("/login")
  } else {
    next()
  }
})

export default router
