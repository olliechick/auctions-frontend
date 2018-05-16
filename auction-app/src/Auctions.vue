<template>
  <div>

    <h1 class="title"> Home </h1>

    <navbar></navbar>

    <!-- Taskbar -->

    <table class="taskbar">
      <tr>

        <!-- Search bar -->
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

        <!-- Category selector -->

        <td>
          <select v-model="selectedCategory" @change="updateSearch()">
            <option disabled selected hidden value="">Categories</option>
            <option value="">all</option>
            <option v-for="category in categories" v-bind:value="category.categoryId">
              {{ category.categoryTitle }}
            </option>
          </select>
        </td>

        <!-- Auction status selector -->

        <td>
          <select v-model="selectedStatus" @change="updateSearch()">
            <option disabled selected hidden value="">Status</option>
            <option v-for="status in statuses" v-bind:value="status">
              {{ status }}
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
          <td class="auctionListTitle">{{ auction.title }}</td>
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
        auctions: [],
        searchTerm: null,
        selectedCategory: "",
        selectedStatus: "",
        categories: [],
        statuses: ["all", "active", "expired", "won", "upcoming"]
      }
    },
    mounted: function () {
      // Get all the auctions and categories
      this.getAuctions();
      this.getCategories();
    },
    methods: {

      getAuctions: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;
          }, function (error) {
            console.log(error);
          });
      },

      getCategories: function () {
        console.log("getting cats");
        this.$http.get('http://127.0.0.1:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            console.log(error);
          });
      },

      updateSearch: function() {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions',
          {params: {"q": this.searchTerm, "category-id": this.selectedCategory, "status": this.selectedStatus} })
          .then(function (response) {
            this.auctions = response.data;
            console.log(response);
          }, function (error) {
            console.log(error);
          });
      }
    }
  }
</script>

<style scoped>

</style>
