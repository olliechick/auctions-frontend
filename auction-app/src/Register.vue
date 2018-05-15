<template>
  <div>

    <h1 class="title"> Register </h1>

    <navbar></navbar>

    register form

    <!-- Register form --

    <form @submit.prevent="register">
      <label>
        Email:
        <input type="email" v-model="user.email"/>
      </label>
      <label>
        Name:
        <input type="text" v-model="user.name"/>
      </label>
      <label>
        Password:
        <input type="password" v-model="user.password"/>
      </label>
      <button type="submit">Submit</button>
    </form>-->

  </div>


</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "Register",
    components: {Navbar}
  }
</script>

<style scoped>

</style>
