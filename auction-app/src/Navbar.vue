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

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary'  v-b-modal.loginModal>
          Log in
        </b-button>

        <b-button class="mb-2 mr-sm-2 mb-sm-0" variant='primary' v-on:click="$goToAnotherPage('/register')">
          Register
        </b-button>

        <b-modal id="loginModal" title="Log in">
          <b-form>
            <b-form-input placeholder="Username"></b-form-input>
            <b-form-input placeholder="Email"></b-form-input>
            <b-form-input placeholder="Password"></b-form-input>
          </b-form>
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
          <b-dropdown-item v-on:click="$goToAnotherPage('/won')">Won</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/bidding_on')">Bidding on</b-dropdown-item>
        </b-dropdown>

        <b-dropdown class="mb-2 mr-sm-2 mb-sm-0" variant='primary' id="sellingDropdown" text="Selling">
          <b-dropdown-item v-on:click="$goToAnotherPage('/auctions/create')">Create auction</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/current')">Items I'm selling</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/sold')">Sold</b-dropdown-item>
          <b-dropdown-item v-on:click="$goToAnotherPage('/unsold')">Unsold</b-dropdown-item>
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
        userId: null
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
