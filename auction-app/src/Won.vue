<template>
  <div>

    <h1 class="title"> Won </h1>

    <navbar></navbar>

    a list of auctions
  </div>

</template>

<script>
  import Navbar from './Navbar.vue'
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        user: null
      }
    },
    mounted: function () {
      // Get the logged in user
      this.getUser();
    },
    methods: {

      getUser: function () {

      }
    }
  }
</script>

<style scoped>

</style>
