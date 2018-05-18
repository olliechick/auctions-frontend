<template>
  <div>

    <h1 class="title"> Create auction </h1>

    <navbar></navbar>

    <b-card bg-variant="light" class="m-3">
      <b-form-group class="m-3">

        <b-form-group label="Auction title:" label-for="auctionTitle" class="mb-2">
          <b-form-input id="auctionTitle"></b-form-input>
        </b-form-group>

        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Start time:</label>
          <b-form-group>
            <b-form-input inline id="startDate" type="date"></b-form-input>
            <b-form-input inline id="startTime" type="time"></b-form-input>
          </b-form-group>
        </b-form>

        <b-form horizontal inline class="mb-2">
          <label class="mr-2">End time:&nbsp;</label>
          <b-form-group>
            <b-form-input inline id="startDate" type="date"></b-form-input>
            <b-form-input inline id="startTime" type="time"></b-form-input>
          </b-form-group>
        </b-form>

        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Category:&nbsp;</label>
          <b-form-group>
            <b-form-select inline v-model="selectedCategory">
              <option v-for="category in categories" v-bind:value="category.categoryId">
                {{ category.categoryTitle }}
              </option>
            </b-form-select>
          </b-form-group>
        </b-form>

        <b-form-file accept="image/jpeg, image/png" class="mb-2" v-model="file"
                     placeholder="Upload a photo..."></b-form-file>

        <b-form-group label="Description:" label-for="auctionTitle" class="mb-2">
          <b-form-textarea id="textarea1" v-model="description" :rows="3"></b-form-textarea>
        </b-form-group>

        <b-btn variant="primary">Create auction</b-btn>


      </b-form-group>
    </b-card>


  </div>
</template>

<script>
  import Navbar from './Navbar.vue'
  import datePicker from 'vue-bootstrap-datetimepicker';

  export default {
    name: "createAuction",
    components: {Navbar, datePicker},
    data() {
      return {
        categories: [],
        selectedCategory: "",
        description: "",
        file: null
      }
    },
    mounted: function () {
      this.$getCategories();
    },
    methods: {
      createAuction: function () {

      },
      onReset: function () {

      }
    }
  }
</script>

<style scoped>

</style>
