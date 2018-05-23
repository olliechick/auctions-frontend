<template>
  <div>

    <h1 class="title"> Items I'm selling </h1>

    <navbar></navbar>

    <!-- Auction list -->

    <b-list-group v-for="auction in auctions" :key="auction.id">
      <b-list-group-item :to="'/auctions/' + auction.id" class="auctionListItem">
        <b-img class="auctionListPhoto" :src="'http://127.0.0.1:4941/api/v1/auctions/' + auction.id + '/photos'"/>
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
        userId: null,
        auctions: null
      }
    },

    mounted: function () {
      this.userId = this.$getUserId();
      this.getAuctions();
    },

    methods: {
      getAuctions: function () {
        console.log(this.token);
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions', {
            params: {
              "seller": this.userId,
              "status": "active"
            }
          }
        ).then(function (response) {
          this.auctions = response.data;
        }, function (error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style scoped>

</style>
