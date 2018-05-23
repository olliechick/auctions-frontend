<template>
  <div>

    <h1 class="title"> Edit user </h1>

    <navbar></navbar>


    <b-form inline @submit="saveUser">

      <b-card bg-variant="light" class="m-4 p-2">

        <b-form-group label="Name">
          <b-form-input v-model="givenName" placeholder="Given name" inline></b-form-input>
          <b-form-input v-model="familyName" placeholder="Family name" inline></b-form-input>
        </b-form-group>

        <b-btn variant="primary" type="submit" class="mt-3">Save</b-btn>
      </b-card>
    </b-form>
  </div>
</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "editUser",
    components: {Navbar},
    data() {
      return {
        givenName: null,
        familyName: null,
        user: {givenName: null, familyName: null},
        userId: null,
        token: null
      }
    },
    mounted: function () {
      this.token = this.$getToken();
      this.initialiseUserData();
    },
    methods: {
      initialiseUserData: function () {
        this.getUser().then(function () {
          console.log(this.user);
          this.givenName = this.user.givenName;
          this.familyName = this.user.familyName;
        });
      },

      getUser() {
        this.userId = this.$route.params.userId;
        return this.$http.get('http://127.0.0.1:4941/api/v1/users/' + this.userId, {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            console.log(error);
            this.errorCode = error.status;
            this.user = null;
          });
      },

      saveUser: function (e) {
        e.preventDefault();
        this.$http.patch('http://127.0.0.1:4941/api/v1/users/' + this.userId, {
          "givenName": this.givenName,
          "familyName": this.familyName
        }, {headers: {'x-authorization': this.token}}
        ).then(function(response) {
          this.$goToAnotherPage('/users/' + this.userId);
        }).catch(function(error) {
alert(error);
        })
      }
    }
  }
</script>

<style scoped>

</style>
