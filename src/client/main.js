import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


import VueResource from 'vue-resource'
import VueNotification from 'vue-notification'

Vue.config.productionTip = false
Vue.use(VueResource);
Vue.use(VueNotification);

new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
