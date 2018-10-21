import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Registration from '@/pages/Registration'

import CreateEvent from '@/pages/CreateEvent'
import ViewEvent from '@/pages/ViewEvent'
import Events from '@/pages/Events'

import ViewUser from '@/pages/ViewUser'

import NotificationSettings from '@/pages/NotificationSettings'
import EditGroup from '@/pages/EditGroup'

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
      component: Home,
      meta: { requiresLogin: true }
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
      path: '/createEvent',
      name: 'CreateEvent',
      component: CreateEvent,
      meta: { requiresLogin: true }
    },
    {
      path: '/event/:id',
      name: 'ViewEvent',
      component: ViewEvent,
      props: true,
      meta: { requiresLogin: true }
    },
    {
      path: '/user/:id',
      name: 'ViewUser',
      component: ViewUser,
      props: true,
      meta: { requiresLogin: true }
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
      meta: { requiresLogin: true }
    },
    {
      path: '/settings',
      name: 'NotificationSettings',
      component: NotificationSettings,
      meta: { requiresLogin: true }
    },
    {
      path: '/group/:id',
      name: 'EditGroup',
      component: EditGroup,
      props: true,
      meta: { requiresLogin: true }
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
