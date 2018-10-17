import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import BootstrapVue from 'bootstrap-vue';

import App from './App.vue';
import Home from './Home.vue';
import Won from './Won.vue';
import BiddingOn from './BiddingOn.vue';
import Current from './Current.vue';
import Sold from './Sold.vue';
import Unsold from './Unsold.vue';
import User from './User.vue';
import EditUser from './EditUser.vue';
import Register from './Register.vue';
import Auction from './Auction.vue';
import EditAuction from './EditAuction.vue';
import CreateAuction from './CreateAuction.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.http.options.emulateJSON = true;

const basepath = process.env.BASE_PATH || '/auctions';
const routes = [
  {
    path: basepath + "/",
    component: Home
  },
  {
    path: basepath + "/won",
    name: "won",
    component: Won
  },
  {
    path: basepath + "/bidding_on",
    name: "biddingOn",
    component: BiddingOn
  },
  {
    path: basepath + "/current",
    name: "current",
    component: Current
  },
  {
    path: basepath + "/sold",
    name: "sold",
    component: Sold
  },
  {
    path: basepath + "/unsold",
    name: "unsold",
    component: Unsold
  },
  {
    path: basepath + "/register",
    name: "register",
    component: Register
  },
  {
    path: basepath + "/users/:userId",
    name: "user",
    component: User
  },
  {
    path: basepath + "/users/:userId/edit",
    name: "editUser",
    component: EditUser
  },
  {
    path: basepath + "/auctions/create",
    name: "saveAuction",
    component: CreateAuction
  },
  {
    path: basepath + "/auctions/:auctionId",
    name: "auction",
    component: Auction
  },
  {
    path: basepath + "/auctions/:auctionId/edit",
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
    $login: function (username, password) {
      return this.$http.post('http://127.0.0.1:4941/api/v1/users/login',
        JSON.stringify({"username": username, "password": password}))
        .then(function (response) {
          console.log("GOOD");
          console.log(response);
          localStorage.setItem("token", response.data["token"]); //store token
          localStorage.setItem("id", response.data["id"]); //store id
          location.reload();
        }).catch(function (error) {
          console.log(error);
          if (error.status == 400) {
            alert("Incorrect username or password.");
          } else {
            alert("Error: " + error.status);
          }
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
      return this.$http.get('http://127.0.0.1:4941/api/v1/auctions/' + this.auctionId, {headers: {'x-authorization': this.token}})
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
