<template>
  <div>

    <h1 class="title"> Edit user </h1>

    <navbar></navbar>


    <b-form inline @submit="saveAuction">

      <b-card bg-variant="light" class="m-4 p-2">

        <!-- Auction title -->
        <b-form-group label="Name">
          <b-form-input id="auctionTitle" v-model="givenName" placeholder="Given name" inline></b-form-input>
          <b-form-input id="auctionTitle" v-model="familyName" placeholder="Family name" inline></b-form-input>
        </b-form-group>

        <b-btn variant="primary" type="submit" class="mt-3">Save</b-btn>
      </b-card>
    </b-form>

    {{givenName}}
<!--todo finish -->
  </div>
</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "editUser",
    components: {Navbar},
    data() {
      return {
        givenName: null,
        familyName: null,
        user: null
      }
    },
    mounted: function () {
      //this.initialiseUserData();
      this.givenName = "t";
    },
    methods: {
      initialiseUserData: function () {
        this.givenName = user.givenName;
        this.givenName = "t";

      }
    }
  }
</script>

<style scoped>

</style>
