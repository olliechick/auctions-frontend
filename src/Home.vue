<template>
  <div>

    <h1 class="title"> Home </h1>

    <navbar></navbar>

    <!-- Modal that explains stuff, which pops up when users first go to site -->
    <b-modal ref="explanationModal" title="Hi!" ok-only >
      <b>TLDR</b>: You can't upload images.<br /><br />
      This is an auction website I created for an assignment at the University of Canterbury in May 2018.<br />
      Since then, I've made some minor tweaks so that it runs in a production environment, uploaded the tutor's backend
      to a private repo on GitHub, set up a free Heroku server that it deploys from, and uploaded this frontend to my website.<br />
      There are therefore some limitations - uploading photos to auctions doesn't work, and the server will sometimes be a bit slow.<br />
      But other than that, feel free to have a play (and if you want, check out <a href="http://olliechick.co.nz">my website</a>).<br /><br />
      &mdash; Ollie Chick, October 2018
    </b-modal>

    <!-- Taskbar -->
    <b-form inline @submit.prevent="updateSearch" id="searchform" class="taskbar">

      <!-- Search box -->
      <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input v-model="searchTerm"></b-form-input>
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

    <b-list-group v-for="auction in auctions" :key="auction.id">
      <b-list-group-item :to="$basePath + '/auctions/' + auction.id" class="auctionListItem">
        <b-img class="auctionListPhoto" :src="'https://ollie-auction-backend.herokuapp.com/api/v1/auctions/' + auction.id + '/photos'"/>
        {{ auction.title }}
      </b-list-group-item>
    </b-list-group>

    <b-pagination @input="updateSearch()" align="center" class="mt-2" v-model="currentPage" :total-rows="numberOfAuctions"
                  :per-page="itemsPerPage" :limit="10"/>

  </div>
</template>


<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "Home",
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
        statuses: ["all", "active", "expired", "won", "upcoming"],
        itemsPerPage: 10,
        currentPage: 1,
        numberOfAuctions: 0
      }
    },
    mounted: function () {
      this.$refs.explanationModal.show();
      // Get all the auctions and categories
      this.getAuctions();
      this.$getCategories();
    },
    methods: {

      getAuctions: function () {
        this.$http.get('https://ollie-auction-backend.herokuapp.com/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;
            this.numberOfAuctions = this.auctions.length;
            this.updateSearch();
          }, function (error) {
            console.log(error);
          });
      },

      updateSearch: function () {
        this.$http.get('https://ollie-auction-backend.herokuapp.com/api/v1/auctions', {
            params: {
              "q": this.searchTerm,
              "category-id": this.selectedCategory,
              "status": this.selectedStatus/*,
              "startIndex": (this.itemsPerPage * this.currentPage-1) - 1,
              "count": this.itemsPerPage*/
            }
          }
        ).then(function (response) {
          this.auctions = response.data;
          // if using startIndex and count, remove the below two lines
          this.numberOfAuctions = this.auctions.length;
          //this.auctions = this.auctions.slice(0, 4);
          this.auctions = this.auctions.slice(this.itemsPerPage * (this.currentPage-1), (this.itemsPerPage * this.currentPage-1));
        }, function (error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style scoped>

</style>
