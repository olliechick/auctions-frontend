<template>
  <div>

    <h1 class="title"> {{ auction.title }} </h1>
    <navbar></navbar>

    <b-container v-if="errorMessage === ''">
      <b-row>
        <b-col cols="8">
          <b-img fluid thumbnail :src="'http://127.0.0.1:4941/api/v1/auctions/' + this.auctionId + '/photos'"/>
          <b-card title="Description" class="mb-2 mt-2">
            <p class="card-text">
              {{ auction.description }}
            </p>
          </b-card>

        </b-col>
        <b-col>

          <!-- Edit button, for the owner of the auction -->
          <b-button v-if="this.auction.seller.id !== this.$getUserId()" block variant="primary"
                    v-on:click="$goToAnotherPage('/auctions/' + auctionId + '/edit')">
            Edit
          </b-button>


          <!-- Auction information card -->
          <b-card title="Auction information" class="mb-2 mt-2">
            <p class="card-text">

              <b>Seller</b>:
              <b-link v-on:click="$goToAnotherPage('/users/' + auction.seller.id)">
                {{ auction.seller.username }}
              </b-link>
              <br/>

              <b>Starts</b>: {{auction.starts}}
              <br/>

              <b>Ends</b>: {{auction.ends}}
              <br/>

            </p>
          </b-card>

          <!-- Place a bid form (if user is eligible to bid) -->
          <b-form v-if="userIsEligibleToBid()" inline class="mb-2 mt-2">
            <b-input-group prepend="$">
              <b-form-input :value="getSuggestedBid()"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary">Bid</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form>


          <!-- Current bid card (if there is one)-->
          <b-card v-if="bidHistory.length > 0" title="Current bid" class="mb-2 mt-2">
            <b-card-body>
              <div class="bidAmount">{{ bidHistory[0].amountInDollars }}</div>
              {{ bidHistory[0].time }} <br/>
              <b-link v-on:click="$goToAnotherPage('/users/' + bidHistory[0].buyerId)">
                {{ bidHistory[0].buyerUsername }}
              </b-link>
            </b-card-body>
          </b-card>

          <!-- Bid history card -->
          <b-card no-body class="mb-2 mt-2">

            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.accordion1 variant="info">Bid history</b-btn>
            </b-card-header>

            <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-list-item flush v-for="bid in bidHistory.slice(1)" :key="bid.amount">
                  <b-list-group-item>
                    <div class="bidAmount">{{ bid.amountInDollars }}</div>
                    {{ bid.time }} <br/>
                    <b-link v-on:click="$goToAnotherPage('/users/' + bid.buyerId)">
                      {{ bid.buyerUsername }}
                    </b-link>
                  </b-list-group-item>

                </b-list-item>
                <div v-if="bidHistory.length === 0">
                  No bids!
                </div>
              </b-card-body>
            </b-collapse>

          </b-card>

        </b-col>
      </b-row>
    </b-container>

    <b-alert v-else-if="errorMessage === 'Loading'" variant="info" show>{{ errorMessage }}</b-alert>

    <b-alert v-else variant="danger" show>{{ errorMessage }}</b-alert>

  </div>
</template>

<script>
  import Navbar from './Navbar.vue'

  export default {
    name: "auction",
    components: {Navbar},
    data() {
      return {
        token: '',
        auction: {title: "Auction details"},
        auctionId: null,
        errorMessage: 'Loading',
        bidHistory: []
      }
    },

    mounted: function () {
      this.token = this.$getToken();
      this.$getAuction();
      this.getBidHistory();
    },

    methods: {
      getBidHistory() {
        this.auctionId = this.$route.params.auctionId;
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions/' + this.auctionId + '/bids',
          {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.bidHistory = response.data;

            // Sorts bids in chronological order, most recent to least recent
            this.bidHistory.sort(function (a, b) {
              return b.datetime - a.datetime;
            });

            // Add the custom fields for displaying
            this.bidHistory.forEach(function (part, index, theArray) {
              let dollars = theArray[index].amount / 100;
              theArray[index].amountInDollars = dollars.toLocaleString("en-NZ", {
                style: "currency",
                currency: "NZD",
                minimumFractionDigits: 2
              });
              theArray[index].time = new Date(theArray[index].datetime).toLocaleString();
            });
            console.log(this.bidHistory);
          }, function (error) {
            console.log(error);
          })
      },

      /**
       * Returns true if the logged-in user can bid on this auction.
       * Specifically, if:
       * - They are logged in
       * - They are not the owner of this auction
       * - The auctions has started but not ended
       * @returns {boolean} true if the logged-in user can bid on the auction
       */
      userIsEligibleToBid() {
        return (this.$getUserId() != null
          && this.auction.seller.id !== this.$getUserId()
          && this.auction.startDateTime <= Date.now()
          && this.auction.endDateTime > Date.now());
      },

      /**
       * Returns the suggested bid for the user to make. It is either:
       * - the reserve price, if no bids have been placed, or
       * - the current bid + 1 cent
       * @returns {string}
       */
      getSuggestedBid() {
        console.log("RESERVE " + this.auction.reservePrice / 100);
        console.log(this.bidHistory);
        let dollars;
        if (this.bidHistory.length === 0) {
          // no bids yet
          console.log("no bids");
          dollars = this.auction.reservePrice / 100;
        } else {
          dollars = (this.auction.currentBid + 1) / 100;
        }
        return dollars.toLocaleString("en-NZ", {
          minimumFractionDigits: 2
        });
      }
    }
  }
</script>

<style scoped>

</style>
