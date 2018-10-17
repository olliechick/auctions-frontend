<template>
  <div>

    <!-- User not logged in -->
    <div v-if="user == null">
      <h1 class="title"> User details </h1>
      <navbar></navbar>

      <div v-if="errorCode != null">
        <b-alert variant="danger" show>{{ getErrorMessage() }}</b-alert>
      </div>

    </div>

    <!-- Loading -->
    <div v-else-if="user.username === ''">

      <h1 class="title"> User details </h1>
      <navbar></navbar>

      <b-alert variant="info" show>Loading</b-alert>
    </div>

    <!-- User logged in -->
    <div v-else>

      <h1 class="title"> User details: {{ user.username }} </h1>
      <navbar></navbar>

      <div>
        <b-card inline class="m-3">

          <div v-if="user.email || user.accountBalance">
            <b-button style="float:right" variant="primary"
                      v-on:click="$goToAnotherPage('/users/' + userId + '/edit')">
              Edit
            </b-button>
          </div>

          <div v-if="user.givenName || user.familyName">
            <b>Name:</b> {{ user.givenName }} {{user.familyName}} <br/>
          </div>

          <b>Username:</b> {{ user.username }} <br/>

          <div v-if="user.email || user.accountBalance">
            <b>Email:</b> {{ user.email }} <br/>
            <b>Account balance:</b> {{ user.accountBalanceDollars }} <br/>
          </div>

        </b-card>
      </div>

    </div>


  </div>
</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "user",
    components: {Navbar},
    data() {
      return {
        token: '',
        user: {username: "", givenName: "", familyName: ""},
        userId: null,
        errorCode: null,
        errorMessage: ''
      }
    },
    watch: {
      '$route'() {
        this.user = {username: "", givenName: "", familyName: ""};
        this.getUser();
      }
    },
    mounted: function () {
      this.token = this.$getToken();
      this.getUser();
    },
    methods: {
      getUser() {
        this.userId = this.$route.params.userId;
        this.$http.get('https://ollie-auction-backend.herokuapp.com/api/v1/users/' + this.userId, {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.user = response.data;
            this.user.accountBalanceDollars = (this.user.accountBalance/100).toLocaleString("en-NZ", {
              style: "currency",
              currency: "NZD",
              minimumFractionDigits: 2
            });
          }, function (error) {
            console.log(error);
            this.errorCode = error.status;
            this.user = null;
          });
      },

      getErrorMessage() {
        switch (this.errorCode) {
          case 401:
            return "Error: Unauthorised.";
          case 404:
            return "Error: User does not exist.";
          default:
            return "Error.";
        }
      }
    }
  }
</script>

<style scoped>

</style>
