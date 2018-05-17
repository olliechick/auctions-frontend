<template>
  <div>

    <!-- User not logged in -->
    <div v-if="user == null">
      <h1 class="title"> User details </h1>
      <navbar></navbar>

      <div v-if="errorCode === 401">
        <b-alert variant="danger" show>Error: Unauthorised.</b-alert>
      </div>

      <div v-else-if="errorCode === 404">
        <b-alert variant="danger" show>Error: User does not exist.</b-alert>
      </div>

      <div v-else>
        <b-alert variant="danger" show>Error.</b-alert>
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

      <b-table striped hover :items="[user]"></b-table>

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
        errorCode: 0
      }
    },
    watch: {
      '$route' () {
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
        let userId = this.$route.params.userId;
        this.$http.get('http://127.0.0.1:4941/api/v1/users/' + userId, {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            console.log(error);
            this.errorCode = error.status;
            this.user = null;
          });
      }
    }
  }
</script>

<style scoped>

</style>
