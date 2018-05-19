<template>
  <div>

    <h1 class="title"> Create auction </h1>

    <navbar></navbar>

    <b-card bg-variant="light" class="m-3">
      <b-form @submit="createAuction" class="m-3">

        <b-form-group label="Auction title:" label-for="auctionTitle" class="mb-2">
          <b-form-input id="auctionTitle" v-model="title" required></b-form-input>
        </b-form-group>

        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Start time:</label>
          <b-form-group>
            <b-form-input :disabled="useCurrentTime" inline type="date" v-model="startDate" required></b-form-input>
            <b-form-input :disabled="useCurrentTime" inline type="time" v-model="startTime" required></b-form-input>
            <b-form-checkbox id="checkbox1" v-model="useCurrentTime" :value="true" :unchecked-value="false"
                             class="m-2" @change="updateUseCurrentTime">
              Now
            </b-form-checkbox>
          </b-form-group>
        </b-form>

        <b-form horizontal inline class="mb-2">
          <label class="mr-2">End time:&nbsp;</label>
          <b-form-group>
            <b-form-input inline type="date" v-model="endDate" required></b-form-input>
            <b-form-input inline type="time" v-model="endTime" required></b-form-input>
          </b-form-group>
        </b-form>

        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Category:&nbsp;</label>
          <b-form-group>
            <b-form-select inline v-model="selectedCategory" required>
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

        <b-btn variant="primary" type="submit">Create auction</b-btn>


      </b-form>
    </b-card>


  </div>
</template>

<script>
  import Navbar from './Navbar.vue'
  import datePicker from 'vue-bootstrap-datetimepicker';
  import {preventDefault} from "bootstrap-vue/src/utils/bv-event.class";

  export default {
    name: "createAuction",
    components: {Navbar, datePicker},
    data() {
      return {
        title: '',
        startDate: '',
        startTime: null,
        endDate: null,
        endTime: null,
        categories: [],
        selectedCategory: "",
        file: null,
        description: "",
        useCurrentTime: true,
        timer: '',
        errors: [],
        value: ''
      }
    },
    mounted: function () {
      this.$getCategories();
      this.initialiseDates();
      this.timer = setInterval(this.setStartTimeToCurrent, 1000);
    },
    methods: {
      createAuction: function (e) {
        // First, validate each field.
        console.log("creating");

        /* Auction title is validated by required attribute */

        /* Start */
        // First, create a Date object
        let start;
        if (this.useCurrentTime) {
          start = new Date();
          // must be valid
        } else {
          start = new Date(this.startDate);
          start.setHours(this.startTime.slice(0, 2));
          start.setMinutes(this.startTime.slice(3, 5));
          // Then, check it is after the current time
          //todo
        }


        let end = new Date(this.endDate);
        end.setHours(this.endTime.slice(0, 2));
        end.setMinutes(this.endTime.slice(3, 5));
        //todo


        e.preventDefault();
      },

      initialiseDates: function () {
        this.setStartTimeToCurrent();

        // Set end date and time to in 1 week
        let d = new Date();
        d.setDate(d.getDate() + 7);
        let year = d.getFullYear();
        let month = ('0' + (d.getMonth() + 1)).slice(-2); // months start from 0; add 0 padding
        let date = ('0' + d.getDate()).slice(-2);       // add 0 padding
        let hour = d.getHours();
        let minute = d.getMinutes();
        this.endDate = year + "-" + month + "-" + date;
        this.endTime = hour + ":" + minute;

        console.log(this.startDate);
      },

      /**
       * Sets the start time to the current time if the "Now" checkbox is checked.
       */
      setStartTimeToCurrent() {
        if (this.useCurrentTime) {
          let d = new Date();
          let year = d.getFullYear();
          let month = ('0' + (d.getMonth() + 1)).slice(-2); // months start from 0; add 0 padding
          let date = ('0' + d.getDate()).slice(-2);       // add 0 padding
          let hour = d.getHours();
          let minute = d.getMinutes();
          this.startDate = year + "-" + month + "-" + date;
          this.startTime = hour + ":" + minute;
        }
      },

      updateUseCurrentTime: function (checked) {
        if (checked) {
          this.setStartTimeToCurrent();
        }
        console.log("toggled");
        console.log(this.useCurrentTime);
      }
    }
  }
</script>

<style scoped>

</style>
