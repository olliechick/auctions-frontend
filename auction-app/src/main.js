import Vue from 'vue'
import App from './App.vue';
import Auctions from './Auctions.vue';
import Won from './Won.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    component: Auctions
  },
  {
    path: "/won",
    name: "won",
    component: Won
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
