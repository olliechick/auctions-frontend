import Vue from 'vue'
import App from './App.vue';
import Auctions from './Auctions.vue';
import Won from './Won.vue';
import Register from './Register.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

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
  },
  {
    path: "/register",
    name: "register",
    component: Register
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
