import Vue from 'vue'
import App from './App.vue';
import Home from './Home.vue';
import Won from './Won.vue';
import User from './User.vue';
import Register from './Register.vue';
import Auction from './Auction.vue';
import EditAuction from './EditAuction.vue';
import CreateAuction from './CreateAuction.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);


// Import date picker css
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';

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
    path:"/auctions/create",
    name: "createAuction",
    component: CreateAuction
  },
  {
    path:"/auctions/:auctionId",
    name: "auction",
    component: Auction
  },
  {
    path:"/auctions/:auctionId/edit",
    name: "editAuction",
    component: EditAuction
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
      return parseInt(localStorage.getItem("id"));
    },

    $getAuction() {
      this.auctionId = this.$route.params.auctionId;
      this.$http.get('http://127.0.0.1:4941/api/v1/auctions/' + this.auctionId, {headers: {'x-authorization': this.token}})
        .then(function (response) {
          this.errorMessage = '';
          this.auction = response.data;
          this.auction.starts = new Date(this.auction.startDateTime).toLocaleString();
          this.auction.ends = new Date(this.auction.endDateTime).toLocaleString();
        }, function (error) {
          console.log(error);
          if (error.status === 400) {
            this.errorMessage = "400: Bad request";
          } else if (error.status === 404) {
            this.errorMessage = "401: Unauthorised";
          } else if (error.status === 404) {
            this.errorMessage = "404: Auction not found.";
          } else {
            this.errorMessage = "Error " + error.status;
          }
          this.user = null;
        });
    },

    $getCategories: function () {
      this.$http.get('http://127.0.0.1:4941/api/v1/categories')
        .then(function (response) {
          this.categories = response.data;
        }, function (error) {
          console.log(error);
        });
    }
  }
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
