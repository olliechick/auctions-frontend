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

Vue.mixin({
  methods: {
    $login: function(username, password) {
      this.$http.post('http://127.0.0.1:4941/api/v1/users/login',
        JSON.stringify({"username": username, "password": password}))
        .then(function(response) {
          localStorage.setItem("token", response.data["token"]); //store token
          localStorage.setItem("id", response.data["id"]); //store id
          this.$router.push('/'); //go back home
        }, function (error) {
          console.log(error);
        });
    },

    $goToAnotherPage: function (page) {
      this.$router.push(page);
    },
  }
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
