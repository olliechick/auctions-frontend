import Vue from 'vue'
import App from './App.vue';
import Auctions from './Auctions.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Auctions
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
