<template>
  <div>

    <h1 class="title"> {{ auction.title }} </h1>
    <navbar></navbar>

    <div v-if="errorMessage === ''">

      <b-container>
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

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-btn block href="#" v-b-toggle.accordion1 variant="info">Bid history</b-btn>
              </b-card-header>
              <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>

                  <b-list-group flush v-for="bid in bidHistory">
                    <b-list-group-item>
                      <div class="bidAmount">{{ bid.amountInDollars }}</div>
                      {{ bid.time }} <br/>
                      <b-link v-on:click="$goToAnotherPage('/users/' + bid.buyerId)">
                        {{ bid.buyerUsername }}
                      </b-link>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-collapse>
            </b-card>

          </b-col>
        </b-row>
      </b-container>

    </div>

    <div v-else-if="errorMessage === 'Loading'">
      <b-alert variant="info" show>{{ errorMessage }}</b-alert>
    </div>

    <div v-else>
      <b-alert variant="danger" show>{{ errorMessage }}</b-alert>
    </div>

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
        bidHistory: ['a', 'b']
      }
    },
    mounted: function () {
      this.token = this.$getToken();
      this.getAuction();
      this.getBidHistory();
    },
    methods: {
      getAuction() {
        this.auctionId = this.$route.params.auctionId;
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions/' + this.auctionId, {headers: {'x-authorization': this.token}})
          .then(function (response) {
            console.log("nice");
            this.errorMessage = '';
            this.auction = response.data;
            this.auction.starts = new Date(this.auction.startDateTime).toLocaleString();
            this.auction.ends = new Date(this.auction.endDateTime).toLocaleString();
            console.log(this.auction);
          }, function (error) {
            console.log(error);
            if (error.status === 400) {
              this.errorMessage = "400: Bad request";
            } else if (error.status === 404) {
              this.errorMessage = "401: Unauthorized";
            } else if (error.status === 404) {
              this.errorMessage = "404: Auction not found.";
            } else {
              this.errorMessage = "Error " + error.status;
            }
            this.user = null;
          });
      },

      getBidHistory() {
        this.auctionId = this.$route.params.auctionId;
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions/' + this.auctionId + '/bids',
          {headers: {'x-authorization': this.token}})
          .then(function (response) {
            this.bidHistory = response.data;

            // Sorts bids in chronological order, most recent to least recent
            this.bidHistory.sort(function(a, b) {
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

      }
    }
  }
</script>

<style scoped>

</style>
