<template>
  <div>

    <h1 class="title"> Edit auction </h1>

    <navbar></navbar>

    I'll probably replace this with a special case of create.

  </div>
</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "__NAME__",
    components: {Navbar},
    data() {
      return {
        auction: {title: "test"}
      }
    },
    mounted: function () {
      this.auction = this.$getAuction();
    },
    methods: {}
  }
</script>

<style scoped>

</style>
