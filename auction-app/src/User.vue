<template>
  <div>

    <!-- User not logged in -->
    <div v-if="user == null">
      <h1 class="title"> Unauthorised. </h1>
      <navbar></navbar>
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
        user: {username: ""}
      }
    },
    mounted: function () {
      this.token = this.$getToken();
      this.getUser();
    },
    methods: {
      getUser() {
        let userId = this.$route.params.userId;
        console.log(userId);
        this.$http.get('http://127.0.0.1:4941/api/v1/users/' + userId, {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            this.user = null;
            console.log(error);
          });

      }
    }
  }
</script>

<style scoped>

</style>
