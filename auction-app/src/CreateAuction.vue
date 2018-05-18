<template>
  <div>

    <h1 class="title"> Create auction </h1>

    <navbar></navbar>

    <b-form-group class="m-3">
      <b-form-group horizontal label="Auction title:" label-for="auctionTitle">
        <b-form-input id="auctionTitle"></b-form-input>
      </b-form-group>
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <date-picker v-model="date" :config="config"></date-picker>
          </div>
        </div>
      </div>
    </b-form-group>


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
        date: new Date(),
        config: {
          format: 'DD/MM/YYYY',
          useCurrent: false,
        }
      }
    },
    mounted: function () {
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
