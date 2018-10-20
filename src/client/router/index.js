import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Error from '@/pages/Error'

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
      path: '/*',
      name: 'Error',
      component: Error
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Middleware
  next();
});

export default router
