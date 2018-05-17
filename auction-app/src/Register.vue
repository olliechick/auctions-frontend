<template>
  <div>

    <h1 class="title"> Register </h1>

    <navbar></navbar>

    <!-- Register form -->

    <form @submit.prevent="register">
      <label>
        Name:
        <input type="text" v-model="givenName" placeholder="Given name"/>
        <input type="text" v-model="familyName" placeholder="Family name"/>
      </label>
      <br/>
      <label>
        Username:
        <input type="text" required="required" v-model="username"/>
      </label>
      <br/>
      <label>
        Email:
        <input type="email" v-model="email" placeholder="user@example.com"/>
      </label>
      <br/>
      <label>
        Password:
        <input type="password" required="required" v-model="password"/>
      </label>
      <br/>
      <button type="submit">Register</button>
    </form>

  </div>


</template>

<script>
  import Navbar from './Navbar.vue'

  let validator = require("email-validator");

  export default {
    name: "Register",
    components: {Navbar},
    data() {
      return {
        givenName: '',
        familyName: '',
        username: '',
        email: '',
        password: '',
        token: ''
      }
    },
    methods: {
      register() {
        if (!validator.validate(this.email)) {
          alert("That email is invalid.");
        } else {
          this.$http.post('http://127.0.0.1:4941/api/v1/users', JSON.stringify({
            "username": this.username,
            "givenName": this.givenName,
            "familyName": this.familyName,
            "email": this.email,
            "password": this.password
          }))
            .then(function (response) {
              this.$login(this.username, this.password);
              alert("Registration successful! You are now logged in, " + this.username);
            }, function (error) {
              if (error.status === 400) {
                alert("That username or email address is already taken.");
              } else {
                alert("Server error. Please try again later.");
              }
              console.log(error);
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>
