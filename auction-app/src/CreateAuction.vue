<template>
  <div>

    <h1 class="title"> Create auction </h1>

    <navbar></navbar>

    <b-form @submit="createAuction">

      <b-card bg-variant="light" class="m-4" title="Details">

        <!-- Auction title -->
        <b-form-group label="Auction title:" label-for="auctionTitle" class="mb-2">
          <b-form-input id="auctionTitle" v-model="title" required></b-form-input>
        </b-form-group>

        <!-- Category -->
        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Category:&nbsp;</label>
          <b-form-group>
            <b-form-select inline v-model="selectedCategory"><!-- :state="categoryState"-->
              <option v-for="category in categories" v-bind:value="category.categoryId">
                {{ category.categoryTitle }}
              </option>
            </b-form-select>
          </b-form-group>
        </b-form>

      </b-card>

      <b-card bg-variant="light" class="m-4" title="Pricing">

        <!-- Starting price -->
        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Starting price:&nbsp;</label>
          <b-input-group prepend="$">
            <b-form-input v-model="startingPrice" type="number" :state="startingPriceIsValid()" min="0" step="0.01"
                          required @input="updateReservePrice"></b-form-input>
          </b-input-group>
        </b-form>

        <!-- Reserve price -->
        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Reserve price:</label>
          <b-input-group prepend="$">
            <b-form-input :disabled="useStartingPrice" v-model="reservePrice" type="number"
                          :state="reservePriceIsValid()" min="0" step="0.01" required></b-form-input>
          </b-input-group>
          <b-form-checkbox v-model="useStartingPrice" :value="true" :unchecked-value="false"
                           class="m-2" @change="updateUseStartingPrice">
            Use starting price
          </b-form-checkbox>
        </b-form>

      </b-card>

      <b-card bg-variant="light" class="m-4" title="Duration">

        <!-- Start time -->
        <b-form horizontal inline class="mb-2">
          <label class="mr-2">Start time:</label>
          <b-form-group>
            <b-form-input :disabled="useCurrentTime" inline type="date" v-model="startDate" required></b-form-input>
            <b-form-input :disabled="useCurrentTime" inline type="time" v-model="startTime" required></b-form-input>
            <b-form-checkbox v-model="useCurrentTime" :value="true" :unchecked-value="false"
                             class="m-2" @change="updateUseCurrentTime">
              Now
            </b-form-checkbox>
          </b-form-group>

        </b-form>

        <!-- End time -->
        <b-form horizontal inline class="mb-2">
          <label class="mr-2">End time:&nbsp;</label>
          <b-form-group>
            <b-form-input inline type="date" v-model="endDate" required></b-form-input>
            <b-form-input inline type="time" v-model="endTime" required></b-form-input>
          </b-form-group>
        </b-form>

      </b-card>

      <b-card bg-variant="light" class="m-4" title="Extra information">

        <!-- Photo -->
        <b-form-file accept="image/jpeg, image/png" class="mb-2" v-model="file"
                     placeholder="Upload a photo..." id="imageForm"></b-form-file>

        <b-form-group label="Description:" label-for="auctionTitle" class="mb-2">
          <b-form-textarea id="textarea1" v-model="description" :rows="3"></b-form-textarea>
        </b-form-group>

      </b-card>

      <!-- "Create auction" submit button -->
      <b-btn variant="primary" type="submit">Create auction</b-btn>

    </b-form>


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
        categories: [],
        selectedCategory: "",
        categoryState: null,

        startingPrice: null,
        reservePrice: null,
        useStartingPrice: true,

        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        useCurrentTime: true,
        timer: '',

        file: null,
        imageType: "unknown",
        description: "",

        start: null,
        end: null,
        startingPriceCents: null,
        reservePriceCents: null,

        errors: [],
        submitAttempted: false,
        token: null
      }
    },
    mounted: function () {
      this.initialiseDates();
      this.$getCategories();
      this.token = this.$getToken();
      this.timer = setInterval(this.updateStartTime, 1000); //update start time (if now is checked) every second
    },
    methods: {
      /**
       * Validates all the fields.
       * If any are invalid, it will alert the user and return false.
       * If all are valid, it return true.
       * @returns {boolean} true if all fields are valid.
       */
      validateAuction: function () {


        /* (Auction title is validated by having the "required" attribute enabled) */

        /* Start price */
        if (this.isValidDollarAmount(this.startingPrice)) {
          this.startingPriceCents = parseInt(this.startingPrice * 100)
        } else {
          alert("Starting price must be a valid dollar amount (a positive number with no more than three decimal places).");
          return false;
        }

        /* Reserve price */
        if (!this.isValidDollarAmount(this.reservePrice)) {
          alert("Reserve price must be a valid dollar amount (a positive number with no more than three decimal places).");
          return false;
        } else if (this.reservePrice < this.startingPrice) {
          alert("Reserve price must be at least as high as the starting price");
          return false;
        } else {
          this.reservePriceCents = parseInt(this.reservePrice * 100);
        }

        /* Start time */
        // If "use current time" is ticked, `start` will be set just before the POST request is made.
        if (!this.useCurrentTime) {
          // First, set the start
          this.start = new Date(this.startDate);
          this.start.setHours(this.startTime.slice(0, 2));
          this.start.setMinutes(this.startTime.slice(3, 5));
          // Then, check it is after the current time
          if (this.start < new Date()) {
            alert("The start time must not be in the past.");
            return false;
          }
        }

        /* End time */
        // First, set the end
        this.end = new Date(this.endDate);
        this.end.setHours(this.endTime.slice(0, 2));
        this.end.setMinutes(this.endTime.slice(3, 5));
        // Then, check it is after the start time
        if (this.end < this.start) {
          alert("The end time must not be before the start time.");
          return false;
        }

        /* Category */
        if (this.selectedCategory === "") {
          alert("You must select a category.");
          return false;
        }

        /* Photo */
        let fileReader = null;
        if (this.file != null) {
          fileReader = new FileReader();
          fileReader.onloadend = function (e) {
            let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
              header += arr[i].toString(16);
            }
            console.log(header);
            switch (header) {
              case "89504e47":
                this.imageType = "image/png";
                break;
              case "ffd8ffe0":
              case "ffd8ffe1":
              case "ffd8ffe2":
              case "ffd8ffe3":
              case "ffd8ffe8":
                this.imageType = "image/jpeg";
                break;
              default:
                this.imageType = "unknown";
                break;
            }
            console.log(this.imageType);
            if (this.imageType === "unknown") {
              alert("Sorry, that file type is unknown. You must provide a jpeg or png image.");
              return false;
            }
            return true;
          };
          fileReader.readAsArrayBuffer(this.file);
console.log("eov");
        }

        /* (Description is optional) */
      },

      createAuction: function (e) {
        console.log("creating");
        this.submitAttempted = true; // denotes that user has tried to submit form

        /* Validate the form */

        if (!this.validateAuction()) {
          // validation failed
          console.log('vf');
          e.preventDefault();
          return;
        }
        console.log("val'd");
        e.preventDefault(); //todo remove

        /* Validation is complete, now send the POST request */

        // If using current date, set it to 1 minute in future (so as to avoid starting it before the server gets the request)
        if (this.useCurrentTime) {
          this.start = new Date();
          this.start.setMinutes(this.start.getMinutes() + 1);
        }

        console.log("Data to send:");
        console.log(this.selectedCategory);
        console.log(this.title);
        console.log(this.description);
        console.log(this.start);
        console.log(this.start.getTime());
        console.log(this.end);
        console.log(this.end.getTime());
        console.log(this.reservePriceCents);
        console.log(this.startingPriceCents);

        // POST auction to server
        this.$http.post('http://127.0.0.1:4941/api/v1/auctions', JSON.stringify({
          "categoryId": this.selectedCategory,
          "title": this.title,
          "description": this.description,
          "startDateTime": this.start.getTime(),
          "endDateTime": this.end.getTime(),
          "reservePrice": this.reservePriceCents,
          "startingBid": this.startingPriceCents
        }), {headers: {'x-authorization': this.token}})
          .then(function (response) {
            let auctionId = response.data.id;
            console.log(auctionId);
            if (this.file != null) {
              //POST auction image to server

              console.log(this.imageType);
              //todo this.imageType is unknown at this point. the filereader loading needs to be finished first.
              this.$http.post('http://127.0.0.1:4941/api/v1/auctions/' + auctionId + '/photos',
                this.file,   // request body
                {            // request options
                  emulateJSON: false,
                  headers: {
                    'X-Authorization': this.token,
                    'Content-Type': this.imageType
                  }
                }
              ).then(function () {
                console.log(this.imageType);
              });
            }
            alert("Auction created! You will now be taken to the auction's page.");
            //this.$goToAnotherPage("/auctions/" + auctionId);
          }, function (error) {
            if (error.status === 400) {
              alert("Error: That was a bad request.");
            } else if (error.status === 401) {
              alert("Error: unauthorised.")
            } else {
              alert("Server error. Please try again later.");
            }
            console.log(error);
          });

        e.preventDefault();
        console.log("created")
      },

      initialiseDates: function () {
        this.setStartTimeToCurrent();

        // Set end date and time to in 1 week
        let d = new Date();
        d.setDate(d.getDate() + 7);
        let year = d.getFullYear();
        let month = ('0' + (d.getMonth() + 1)).slice(-2); // months start from 0; add 0 padding
        let date = ('0' + d.getDate()).slice(-2);       // add 0 padding
        let hour = ('0' + d.getHours()).slice(-2);       // add 0 padding
        let minute = ('0' + d.getMinutes()).slice(-2);       // add 0 padding
        this.endDate = year + "-" + month + "-" + date;
        this.endTime = hour + ":" + minute;
      }
      ,

      /**
       * Sets the start time to the current time if the "Now" checkbox is checked.
       */
      setStartTimeToCurrent() {
        let d = new Date();
        let year = d.getFullYear();
        let month = ('0' + (d.getMonth() + 1)).slice(-2); // months start from 0; add 0 padding
        let date = ('0' + d.getDate()).slice(-2);       // add 0 padding
        let hour = ('0' + d.getHours()).slice(-2);       // add 0 padding
        let minute = ('0' + d.getMinutes()).slice(-2);       // add 0 padding
        this.startDate = year + "-" + month + "-" + date;
        this.startTime = hour + ":" + minute;

      }
      ,

      updateUseCurrentTime: function (checked) {
        if (checked) {
          this.setStartTimeToCurrent();
        }
      }
      ,

      updateStartTime() {
        if (this.useCurrentTime) {
          this.setStartTimeToCurrent();
        }
      }
      ,

      setReservePriceToStarting() {
        this.reservePrice = this.startingPrice;
      }
      ,

      updateReservePrice() {
        if (this.useStartingPrice) {
          this.setReservePriceToStarting();
        }
      }
      ,

      updateUseStartingPrice: function (checked) {
        if (checked) {
          this.setReservePriceToStarting();
        }
      }
      ,

      startingPriceIsValid() {
        if (this.submitAttempted) {
          if (this.isValidDollarAmount(this.startingPrice)) {
            return null;
          } else {
            return false;
          }
        }
      }
      ,

      reservePriceIsValid() {
        if (this.submitAttempted && !this.useStartingPrice) {
          if (this.isValidDollarAmount(this.reservePrice) && this.reservePrice >= this.startingPrice) {
            return null;
          } else {
            return false;
          }
        }
      }
      ,

      /**
       * Returns true if it is a valid dollar amount, i.e.:
       * - it is a number
       * - it has no more than 2 decimal places
       * - it is positive
       * @param dollarAmount
       * @returns {boolean} true if it is a valid dollar amount
       */
      isValidDollarAmount(dollarAmount) {
        let pieces;

        // Check it is a positive number
        if ((dollarAmount == "") || (dollarAmount < 0) || (isNaN(dollarAmount)) || dollarAmount == null) {
          return false;
        } else {
          pieces = dollarAmount.split(".");
        }

        // Check it has no more than 2 decimals (excluding trailing 0s)
        if (pieces.length > 2 ||
          pieces.length === 2 && pieces[1].length > 2 && parseInt(pieces[1].slice(2)) !== 0) {
          return false;
        }

        return true;
      }
    }
  }
</script>

<style scoped>

</style>
