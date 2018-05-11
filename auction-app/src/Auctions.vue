<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginModal">
      Log in
    </button>
    <button type="button" class="btn btn-primary" v-on:click="openRegisterPage()">
      Register
    </button>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        user: null
      }
    },
    mounted: function () {
      this.getUser();
    },
    methods: {
      getUser: function () {
        return "";
      },

      openRegisterPage: function() {
        console.log("register clicked");
        alert("Not yet implemented.");
      }
    }
  }
</script>

<style scoped>

</style>
