<template>
  <div>

    <h1 class="title"> Create auction </h1>

    <navbar></navbar>

    <fill-out-auction-details></fill-out-auction-details>

  </div>
</template>

<script>
  import Navbar from './Navbar.vue'
  import FillOutAuctionDetails from './FillOutAuctionDetails.vue'

  export default {
    name: "createAuction",
    components: {Navbar, FillOutAuctionDetails}
  }
</script>

<style scoped>

</style>
