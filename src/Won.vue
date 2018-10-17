<template>
  <div>

    <h1 class="title"> Won </h1>

    <navbar></navbar>

    <!-- Auction list -->

    <b-list-group v-for="auction in auctions" :key="auction.id">
      <b-list-group-item :to="$basePath + '/auctions/' + auction.id" class="auctionListItem">
        <b-img class="auctionListPhoto" :src="'https://ollie-auction-backend.herokuapp.com/api/v1/auctions/' + auction.id + '/photos'"/>
        {{ auction.title }}
      </b-list-group-item>
    </b-list-group>

  </div>

</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    components: {Navbar},
    data() {
      return {
        error: "",
        errorFlag: false,
        user: null,
        auctions: null,
        token: null
      }
    },

    mounted: function () {
      this.token = this.$getToken();
      this.getAuctions();
    },

    methods: {
      getAuctions: function () {
        console.log(this.token);
        this.$http.get('https://ollie-auction-backend.herokuapp.com/api/v1/my_won_auctions', {
          headers: {'x-authorization': this.token}
        }).then(function (response) {
          this.auctions = response.data;
          this.numberOfAuctions = this.auctions.length;
        }, function (error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style scoped>

</style>
