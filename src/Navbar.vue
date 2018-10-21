<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div class="taskbar">

      <!-- User not logged in -->
      <div v-if="token == null">

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-on:click="$goToAnotherPage('/')">
          Home
        </b-button>

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-b-modal.loginModal>
          Log in
        </b-button>

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-on:click="$goToAnotherPage('/register')">
          Register
        </b-button>

        <!-- Login form in a modal -->
          <b-modal id="loginModal" title="Log in" @ok="login" ok-title="Log in">
            <label class="mb-2">Please enter either your username or email address, then your password, and press Log in.</label>
            <b-form-input class="mb-2" placeholder="Username" v-model="username"></b-form-input>
            <b-form-input class="mb-2" placeholder="Email" v-model="email" autocomplete="email"></b-form-input>
            <b-form-input class="mb-2" placeholder="Password" v-model="password" type="password"></b-form-input>
          </b-modal>

      </div>

      <!-- User logged in -->
      <div v-else>

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-on:click="$goToAnotherPage('/')">
          Home
        </b-button>

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-on:click="goToUserPage()">
          Me
        </b-button>

        <b-dropdown class="mb-2 mr-sm-2 mb-sm-0" variant='primary' id="buyingDropdown" text="Buying">
          <b-dropdown-item v-on:click="$goToAnotherPage('/won')">Auctions I've won</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/bidding_on')">Auctions I'm bidding on</b-dropdown-item>
        </b-dropdown>

        <b-dropdown class="mb-2 mr-sm-2 mb-sm-0" variant='primary' id="sellingDropdown" text="Selling">
          <b-dropdown-item v-on:click="$goToAnotherPage('/auctions/create')">Create an auction</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/current')">Items I'm selling</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/sold')">Items I've sold</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/unsold')">Unsold items</b-dropdown-item>
        </b-dropdown>

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-on:click="logout()">
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
        token: null,
        userId: null,
        username: '',
        email: '',
        password: ''
      }
    },
    mounted: function () {
      this.token = this.$getToken();
      this.userId = this.$getUserId();
    },
    methods: {

      goToUserPage: function () {
        this.$goToAnotherPage('/users/' + this.userId);
      },

      login: function (e) {
        e.preventDefault(); //don't just refresh
        console.log(this.username + this.email);
        if (this.username === '' && this.email === '') {
          alert("Please enter a username or email address");
        } else if (this.email === '') {
          //login with username
          this.$login(this.username, this.password).then(function() {
            this.token = this.$getToken();
            this.userId = this.$getUserId();
          });
        } else {
          //login with email
          this.$http.post('https://ollie-auction-backend.herokuapp.com/api/v1/users/login',
            JSON.stringify({"email": this.email, "password": this.password}))
            .then(function (response) {
              console.log("Good email");
              this.$postLogin(response);
              this.token = this.$getToken();
              this.userId = this.$getUserId();
            }).catch(function (error) {
            console.log(error);
            if (error.status === 400) {
              alert("Incorrect email or password.");
            } else {
              alert("Error: " + error.status);
            }
          });
        }

      },

      logout: function () {
        localStorage.removeItem("token"); //delete token
        this.token = null;
        localStorage.removeItem("id");
        this.userId = null;
        this.$goToAnotherPage('/'); //go back home
      },
    }
  }
</script>

<style scoped>

</style>
