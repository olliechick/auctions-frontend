<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div class="taskbar">

      <!-- User not logged in -->
      <div v-if="token == null">

          <b-button :variant="'primary'" v-on:click="goToAnotherPage('/')">
            Home
          </b-button>

          <b-button :variant="'primary'" data-toggle="modal" data-target="#loginModal">
            Log in
          </b-button>

          <b-button :variant="'primary'" v-on:click="goToAnotherPage('/register')">
            Register
          </b-button>

      </div>

      <!-- User logged in -->
      <div v-else>

          <b-button :variant="'primary'" v-on:click="goToAnotherPage('/')">
            Home
          </b-button>

          <b-dropdown :variant="'primary'" id="buyingDropdown" text="Buying">
            <b-dropdown-item v-on:click="goToAnotherPage('/won')">Won</b-dropdown-item>
            <b-dropdown-item v-on:click="goToAnotherPage('/bidding_on')">Bidding on</b-dropdown-item>
          </b-dropdown>

          <b-dropdown :variant="'primary'" id="sellingDropdown" text="Selling">
            <b-dropdown-item v-on:click="goToAnotherPage('/create')">Create auction</b-dropdown-item>
            <b-dropdown-item v-on:click="goToAnotherPage('/current')">Items I'm selling</b-dropdown-item>
            <b-dropdown-item v-on:click="goToAnotherPage('/sold')">Sold</b-dropdown-item>
            <b-dropdown-item v-on:click="goToAnotherPage('/unsold')">Unsold</b-dropdown-item>
          </b-dropdown>

          <b-button :variant="'primary'" v-on:click="logout()">
            Log out
          </b-button>

      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "Navbar",
    data() {
      return {
        error: "",
        errorFlag: false,
        token: null
      }
    },
    mounted: function () {
      this.getToken();
      console.log(this.token);
    },
    methods: {

      goToAnotherPage: function (page) {
        console.log("going home");
        this.$router.push(page);
      },

      logout: function () {

        console.log("Logging out")
        localStorage.removeItem("token"); //delete token
        this.token = null;
        console.log(this.token);
      },

      getToken: function () {
        this.token = localStorage.getItem("token");
      },

      login() {
        this.$http.post('http://127.0.0.1:4941/api/v1/users/login',
          JSON.stringify({"username": this.username, "password": this.password}))
          .then(function (response) {
            localStorage.setItem("token", response.data["token"]); //store token
            this.$router.push('/'); //go back home
          }, function (error) {
            console.log(error);
          });

      }
    }
  }
</script>

<style scoped>

</style>
