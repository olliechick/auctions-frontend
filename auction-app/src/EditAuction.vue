<template>
  <div>

    <h1 class="title"> Edit auction </h1>

    <navbar></navbar>

    <fill-out-auction-details></fill-out-auction-details>

  </div>
</template>

<script>
  import Navbar from './Navbar.vue'
  import FillOutAuctionDetails from './FillOutAuctionDetails.vue'

  export default {
    name: "edit",
    components: {
      FillOutAuctionDetails,
      Navbar},
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
