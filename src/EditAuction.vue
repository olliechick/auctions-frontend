<template>
  <div>

    <h1 class="title"> Edit auction </h1>

    <navbar></navbar>

    <b-alert v-if="errorMessage === 'Loading'" variant="info" show>Loading</b-alert>

    <b-alert v-else-if="errorMessage !== ''" variant="danger" show>{{ errorMessage }}</b-alert>

    <!--todo add a warning that the auction will start soon -->

    <b-form v-else @submit="saveAuction">

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
              In 60 seconds
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
        <b-button class="mb-2" variant="danger" v-on:click="deletePhoto()">Delete photo</b-button>

        <b-form-group label="Description:" label-for="auctionTitle" class="mb-2">
          <b-form-textarea id="textarea1" v-model="description" :rows="3"></b-form-textarea>
        </b-form-group>

      </b-card>

      <!-- "Save auction" submit button -->
      <div class="m-4">
        <b-btn block variant="primary" type="submit">Save auction</b-btn>
      </div>

    </b-form>

  </div>
</template>

<script>
  import Navbar from './Navbar.vue'
  import datePicker from 'vue-bootstrap-datetimepicker';
  import {preventDefault} from "bootstrap-vue/src/utils/bv-event.class";

  export default {
    name: "saveAuction",
    components: {Navbar, datePicker},
    data() {
      return {
        auction: null,
        auctionId: 0,

        title: '',
        categories: [],
        selectedCategory: "",
        categoryState: null,

        startingPrice: null,
        reservePrice: null,
        useStartingPrice: false,

        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        useCurrentTime: false,
        timer: '',

        file: null,
        imageType: "unknown",
        description: "",

        start: null,
        end: null,
        startingPriceCents: null,
        reservePriceCents: null,

        errors: [],
        errorMessage: 'Loading',
        submitAttempted: false,
        token: null
      }
    },
    mounted: function () {
      this.initialiseAuctionData();
      this.$getCategories();
      this.token = this.$getToken();
      this.timer = setInterval(this.updateStartTime, 1000); //update start time (if "In 60 seconds" is checked) every second
    },
    methods: {

      initialiseAuctionData: function () {
        this.auctionId = this.$route.params.auctionId;
        this.$http.get('https://ollie-auction-backend.herokuapp.com/api/v1/auctions/' + this.auctionId, {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.errorMessage = '';

            // Load in values necessary to check if they can edit this auction.
            let auction = response.data;

            let d = new Date(auction.startDateTime);

            // Check if they won't be able to edit this auction.
            if (auction.seller.id !== this.$getUserId()) {
              // They don't own this auction
              this.errorMessage = 'Unauthorised';
              return;
            } else if (d < Date.now()) {
              // The auction has started
              this.errorMessage = "Forbidden. The auction has begun."

            }

            // They can edit this auction. Load in the rest of the values from the auction.
            auction.starts = new Date(auction.startDateTime).toLocaleString();
            auction.ends = new Date(auction.endDateTime).toLocaleString();

            this.title = auction.title;
            this.selectedCategory = auction.categoryId;

            this.startingPrice = auction.startingBid / 100;
            this.useStartingPrice = auction.startingBid === auction.reservePrice;
            this.reservePrice = auction.reservePrice / 100;

            let year = d.getFullYear();
            let month = ('0' + (d.getMonth() + 1)).slice(-2); // months start from 0; add 0 padding
            let date = ('0' + d.getDate()).slice(-2);       // add 0 padding
            let hour = ('0' + d.getHours()).slice(-2);       // add 0 padding
            let minute = ('0' + d.getMinutes()).slice(-2);       // add 0 padding
            this.startDate = year + "-" + month + "-" + date;
            this.startTime = hour + ":" + minute;

            d = new Date(auction.endDateTime);
            year = d.getFullYear();
            month = ('0' + (d.getMonth() + 1)).slice(-2); // months start from 0; add 0 padding
            date = ('0' + d.getDate()).slice(-2);       // add 0 padding
            hour = ('0' + d.getHours()).slice(-2);       // add 0 padding
            minute = ('0' + d.getMinutes()).slice(-2);       // add 0 padding
            this.endDate = year + "-" + month + "-" + date;
            this.endTime = hour + ":" + minute;

            this.description = auction.description;

          }, function (error) {
            console.log(error);
            if (error.status === 400) {
              this.errorMessage = "400: Bad request";
            } else if (error.status === 401) {
              this.errorMessage = "401: Unauthorised";
            } else if (error.status === 404) {
              this.errorMessage = "404: Auction not found.";
            } else {
              this.errorMessage = "Error " + error.status;
            }
            this.user = null;
          });

      },

      deletePhoto() {
        this.$http.delete('https://ollie-auction-backend.herokuapp.com/api/v1/auctions/' + this.auctionId + '/photos', {headers: {'x-authorization': this.token}})
          .then(function (response) {
            alert("Photo deleted!");
          }, function (error) {
            if (error.status === 404) {
              alert("Eroror 404: Auction not found.");
            } else if (error.status === 401) {
              alert("Error 401: Unauthorised.");
            } else {
              alert("Server error. Please try again later.");
            }
            console.log(error);
          });
      },

      getImageTypeFromFile: function (file) {
        let fileReader = new FileReader();
        let imageType;

        return new Promise((resolve, reject) => {

          fileReader.onerror = function (e) {
            reject("Load error");
          };

          fileReader.onloadend = function (e) {
            let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
              header += arr[i].toString(16);
            }

            switch (header) {
              case "89504e47":
                imageType = "image/png";
                break;
              case "ffd8ffe0":
              case "ffd8ffe1":
              case "ffd8ffe2":
              case "ffd8ffe3":
              case "ffd8ffe8":
                imageType = "image/jpeg";
                break;
              default:
                imageType = "unknown";
                break;
            }
            resolve(imageType);
          };
          fileReader.readAsArrayBuffer(file);

        });

      },

      /**
       * Validates all the fields and saves the auction.
       * If any are invalid, it will alert the user.
       */
      saveAuction: function (e) {
        this.submitAttempted = true; // denotes that user has tried to submit form
        e.preventDefault(); // prevent page from refreshing

        // First, validate what can be done synchronously

        /* (Auction title is validated by having the "required" attribute enabled) */

        /* Start price */
        if (this.isValidDollarAmount(this.startingPrice)) {
          this.startingPriceCents = parseInt(this.startingPrice * 100)
        } else {
          alert("Starting price must be a valid dollar amount (a positive number with no more than two decimal places).");
          return;
        }

        /* Reserve price */
        if (!this.isValidDollarAmount(this.reservePrice)) {
          alert("Reserve price must be a valid dollar amount (a positive number with no more than two decimal places).");
          return;
        } else if (this.reservePrice < this.startingPrice) {
          alert("Reserve price must be at least as high as the starting price");
          return;
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
            return;
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
          return;
        }

        /* Category */
        if (this.selectedCategory === "") {
          alert("You must select a category.");
          return;
        }

        /* (Description is optional) */

        // Now, validate what must be done asynchronously

        /* Photo */
        let fileReader = null;
        if (this.file != null) {
          let getImageTypePromise = this.getImageTypeFromFile(this.file);
          let self = this;
          getImageTypePromise.then(function (imageType) {
            self.imageType = imageType;
            if (self.imageType === "unknown") {
              alert("Sorry, that file type is unknown. You must provide a jpeg or png image.");
              return;
            }

            /* All fields are now validated, generate the auction.*/
            self.generateAuction();

          }).catch(function (error) {
            console.log(error);
            alert("Sorry, there was an error loading that image. Please try again, or use another image.");
            return;
          });

        } else {
          /* All fields are now validated, generate the auction.*/
          this.generateAuction();
        }
      },

      /**
       * Sends one or two post requests to server.
       * One to update the auction, and (if a photo has been added) one to update the photo.
       */
      generateAuction: function () {

        // If using current date, set it to 1 minute in future (so as to avoid starting it before the server gets the request)
        if (this.useCurrentTime) {
          this.start = new Date();
          this.start.setMinutes(this.start.getMinutes() + 1);
        }

        // POST auction to server
        this.$http.patch('https://ollie-auction-backend.herokuapp.com/api/v1/auctions/' + this.auctionId, JSON.stringify({
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
            if (this.file == null) {
              alert("Auction saved! You will now be taken to the auction's page.");
              this.$goToAnotherPage("/auctions/" + this.auctionId);
            } else {
              //POST auction image to server

              this.$http.post('https://ollie-auction-backend.herokuapp.com/api/v1/auctions/' + this.auctionId + '/photos',
                this.file,   // request body
                {            // request options
                  emulateJSON: false,
                  headers: {
                    'X-Authorization': this.token,
                    'Content-Type': this.imageType
                  }
                }
              ).then(function () {
                alert("Auction saved! You will now be taken to the auction's page.");
                this.$goToAnotherPage("/auctions/" + this.auctionId);
              });
            }
          }, function (error) {
            if (error.status === 400) {
              alert("Error 400: That was a bad request.");
            } else if (error.status === 401) {
              alert("Error 401: unauthorised.")
            } else if (error.status === 403) {
              alert("Error 403: forbidden. The auction has begun.")
            } else if (error.status === 404) {
              alert("Error 404: auction not found.")
            } else {
              alert("Server error. Please try again later.");
            }
            console.log(error);
          });
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
      },

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

      },

      updateUseCurrentTime: function (checked) {
        if (checked) {
          this.setStartTimeToCurrent();
        }
      },

      updateStartTime() {
        if (this.useCurrentTime) {
          this.setStartTimeToCurrent();
        }
      },

      setReservePriceToStarting() {
        this.reservePrice = this.startingPrice;
      },

      updateReservePrice() {
        if (this.useStartingPrice) {
          this.setReservePriceToStarting();
        }
      },

      updateUseStartingPrice: function (checked) {
        if (checked) {
          this.setReservePriceToStarting();
        }
      },

      startingPriceIsValid() {
        if (this.submitAttempted) {
          if (this.isValidDollarAmount(this.startingPrice)) {
            return null;
          } else {
            return false;
          }
        }
      },

      reservePriceIsValid() {
        if (this.submitAttempted && !this.useStartingPrice) {
          if (this.isValidDollarAmount(this.reservePrice) && this.reservePrice >= this.startingPrice) {
            return null;
          } else {
            return false;
          }
        }
      },

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
        dollarAmount = dollarAmount.toString();

        // Check it is a positive number
        console.log(dollarAmount);
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
