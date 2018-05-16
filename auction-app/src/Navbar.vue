<template>
<div>
  <div v-if="errorFlag" style="color: red;">
    {{ error }}
  </div>

  <table class="taskbar">
    <tr>

      <td>
        <button type="button" class="btn tabbtn" v-on:click="goToAnotherPage('/')">
          Home
        </button>
      </td>

      <!-- User not logged in -->
      <div v-if="user != null">
        <td>
          <button type="button" class="btn actionbtn" data-toggle="modal" data-target="#loginModal">
            Log in
          </button>
        </td>
        <td>
          <button type="button" class="btn actionbtn" v-on:click="goToAnotherPage('/register')">
            Register
          </button>
        </td>
      </div>

      <!-- User logged in -->
      <div v-else>
        <td>
          <div class="dropdown">
            <button v-on:click="toggleBuyingDropdown()" id="buyingdropbtn" class="btn dropbtn">
              Buying ▼
            </button>
            <div id="buyingDropdown" class="dropdown-content">
              <a v-on:click="goToAnotherPage('/won')">Won</a>
              <a v-on:click="goToAnotherPage('/bidding_on')">Bidding on</a>
            </div>
          </div>
        </td>

        <td>
          <div class="dropdown">
            <button v-on:click="toggleSellingDropdown()" id="sellingdropbtn" class="btn dropbtn">
              Selling ▼
            </button>
            <div id="sellingDropdown" class="dropdown-content">
              <a v-on:click="goToAnotherPage('/create')">Create auction</a>
              <a v-on:click="goToAnotherPage('/current')">Items I'm selling</a>
              <a v-on:click="goToAnotherPage('/sold')">Sold</a>
              <a v-on:click="goToAnotherPage('/unsold')">Unsold</a>
            </div>
          </div>
        </td>
        <td>
          <button type="button" class="btn actionbtn" v-on:click="logout()">
            Log out
          </button>
        </td>
      </div>

    </tr>
  </table>
</div>
</template>

<script>
    export default {
      name: "Navbar",
      data() {
        return {
          error: "",
          errorFlag: false,
          user: null
        }
      },
      mounted: function () {

        this.closeDropdownsOnClickOff();
        this.toggleBuyingDropdown();


      },
      methods: {

        toggleBuyingDropdown: function () {
          document.getElementById("buyingDropdown").classList.toggle("show");
        },

        toggleSellingDropdown: function () {
          document.getElementById("sellingDropdown").classList.toggle("show");
        },

        // Close dropdowns if the user clicks outside them
        closeDropdownsOnClickOff: function () {

          function closeAllDropdownsButOne(dropdownToNotClose) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
              let openDropdown = dropdowns[i];
              if (openDropdown.classList.contains('show') && openDropdown.id !== dropdownToNotClose) {
                openDropdown.classList.remove('show');
              }
            }
          }

          window.onclick = function (event) {

            // Not clicking on any dropdown
            if (!event.target.matches('.dropbtn')) {
              let dropdowns = document.getElementsByClassName("dropdown-content");
              for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                  openDropdown.classList.remove('show');
                }
              }

              // Clicking on selling dropdown
            } else if (event.target.matches('#sellingdropbtn')) {
              console.log("Matched selling button");
              closeAllDropdownsButOne("sellingDropdown")

              // Clicking on buying dropdown
            } else if (event.target.matches('#buyingdropbtn')) {
              console.log("Matched buying button");
              closeAllDropdownsButOne("buyingDropdown")
            }
          }
        },

        goToAnotherPage: function (page) {
          console.log("going home");
          this.$router.push(page);
        },

        logout: function () {
          alert("Logout not yet implemented.");
        },

        getUser: function () {
          return "";
          //todo actually code this
        }
      }
    }
</script>

<style scoped>

</style>
