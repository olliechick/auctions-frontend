import Vue from 'vue'
import App from './App.vue';
import Home from './Home.vue';
import Won from './Won.vue';
import User from './User.vue';
import Register from './Register.vue';
import Auction from './Auction.vue';

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
    component: Home
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
  },
  {
    path:"/users/:userId",
    name: "user",
    component: User
  },
  {
    path:"/auctions/:auctionId",
    name: "auction",
    component: Auction
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
      console.log("going");
      console.log(page);
      this.$router.push(page);
    },

    $getToken: function () {
      return localStorage.getItem("token");
    },

    $getUserId: function () {
      return localStorage.getItem("id");
    }
  }
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
