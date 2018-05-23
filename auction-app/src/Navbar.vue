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

        <b-modal id="loginModal" title="Log in">
          <b-form>
            <b-form-input class="mb-2" placeholder="Username" v-model="username"></b-form-input>
            <b-form-input class="mb-2" placeholder="Email" v-model="email" autocomplete="email"></b-form-input>
            <b-form-input class="mb-2" placeholder="Password" v-model="password"></b-form-input>
          </b-form>
          <div slot="modal-footer" class="w-100">
            <b-btn size="m-2" class="float-right" variant="primary" v-on:click="login()">
              Log in
            </b-btn>
          </div>
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

      login: function () {
        console.log(this.username + this.email);
        if (this.username === '' && this.email === '') {
          alert("Please enter a username or email address");
        } else if (this.email === '') {
          //login with username
          this.$login(this.username, this.password).then(function () {
            location.reload() //reload page
          });
        } else {
          //login with email
          this.$http.post('http://127.0.0.1:4941/api/v1/users/login',
            JSON.stringify({"email": this.email, "password": this.password}))
            .then(function (response) {
              localStorage.setItem("token", response.data["token"]); //store token
              localStorage.setItem("id", response.data["id"]); //store id
              location.reload(); //reload page
            }, function (error) {
              console.log(error);
            });
        }

      },

      logout: function () {
        localStorage.removeItem("token"); //delete token
        this.token = null;
        this.$goToAnotherPage('/'); //go back home
      },
    }
  }
</script>

<style scoped>

</style>
