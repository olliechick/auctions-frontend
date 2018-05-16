<template>
  <div>

    <h1 class="title"> Home </h1>

    <navbar></navbar>

    <!-- Taskbar -->
    <b-form inline @submit.prevent="updateSearch" id="searchform" class="taskbar">

      <!-- Search box -->
      <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input v-model="searchTerm" ></b-form-input>
        <b-input-group-append>
          <b-btn class="mb-2 mr-sm-2 mb-sm-0" variant="primary" type="submit">
            <!-- magnifying glass -->
            <div style="transform: rotate(-45deg);">&#9906;</div>
          </b-btn>
        </b-input-group-append>
      </b-input-group>

      <!-- Category selector -->
      <b-form-select v-model="selectedCategory" class="mb-2 mr-sm-2 mb-sm-0" @input="updateSearch()">
        <option disabled selected hidden value="">Category</option>
        <option value="">all</option>
        <option v-for="category in categories" v-bind:value="category.categoryId">
          {{ category.categoryTitle }}
        </option>
      </b-form-select>

      <!-- Auction status selector -->
      <b-form-select v-model="selectedStatus" class="mb-2 mr-sm-2 mb-sm-0" @input="updateSearch()">
        <option disabled selected hidden value="">Status</option>
        <option v-for="status in statuses" v-bind:value="status">
          {{ status }}
        </option>
      </b-form-select>

    </b-form>

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

      updateSearch: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions',
          {params: {"q": this.searchTerm, "category-id": this.selectedCategory, "status": this.selectedStatus}})
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
