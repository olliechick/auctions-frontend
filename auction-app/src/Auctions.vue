<template>
  <div>

    <h1 class="title"> Home </h1>

    <navbar></navbar>

    <!-- Search and category selector -->

    <table class="taskbar">
      <tr>

        <td>
          <form @submit.prevent="updateSearch" id="searchform">

            <label>
              <input type="text" class="searchbox" v-model="searchTerm" placeholder="Search"/>
            </label>

            <button type="submit" class="searchbutton">
              <!-- magnifying glass -->
              <div style="transform: rotate(-45deg);">&#9906;</div>
            </button>

          </form>
        </td>

        <td>
          <select v-model="selectedCategory" @change="updateSearch()">
            <option disabled selected hidden value="">Categories</option>
            <option v-for="category in categories" v-bind:value="category.categoryId">
              {{ category.categoryTitle }}
            </option>
          </select>
        </td>

      </tr>
    </table>

    <!-- Auction list -->

    <div id="auctions">
      <table class="auctionlist">
        <tr v-for="auction in auctions" class="auctionlist">
          <td>
            <img :src="'http://127.0.0.1:4941/api/v1/auctions/' + auction.id + '/photos'" width="200">
          </td>
          <td>{{ auction.title }}</td>
        </tr>
      </table>
    </div>

  </div>
</template>


<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "Auctions",
    components: {Navbar},
    data() {
      return {
        error: "",
        errorFlag: false,
        user: null,
        auctions: [],
        searchTerm: "",
        selectedCategory: "",
        categories: []
      }
    },
    mounted: function () {
      // Get the logged in user
      this.getUser();

      // Get all the auctions and categories
      this.getAuctions();
      this.getCategories();
    },
    methods: {

      getAuctions: function () {
        console.log("getting auctions");
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;
            console.log(response.data);
          }, function (error) {
            console.log(error);
          });
      },

      getCategories: function () {
        console.log("getting cats");
        this.$http.get('http://127.0.0.1:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
            console.log(response.data);
            console.log(this.categories);
            console.log("above2");
          }, function (error) {
            console.log(error);
          });
        console.log(this.categories);
        console.log("above");
      },

      getUser: function () {

      },

      updateSearch: function() {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?q=' + this.searchTerm + '&category-id=' + this.selectedCategory)
          .then(function (response) {
            console.log(response);
            this.auctions = response.data;
            console.log(response.data);
          }, function (error) {
            console.log(error);
          });
      }
    }
  }
</script>

<style scoped>

</style>
