<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <!-- User not logged in -->
    <div v-if="user == null">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginModal">
        Log in
      </button>
      <button type="button" class="btn btn-primary" v-on:click="openRegisterPage()">
        Register
      </button>
    </div>

    <!-- User logged in -->
    <div v-else>
      <div class="dropdown">
        <button v-on:click="toggleBuyingDropdown()" id="buyingdropbtn" class="btn dropbtn">Buying</button>
        <div id="buyingDropdown" class="dropdown-content">
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <a href="#">Link 3</a>
        </div>
      </div>
      <div class="dropdown">
        <button v-on:click="toggleSellingDropdown()" id="sellingdropbtn" class="btn dropbtn">Selling</button>
        <div id="sellingDropdown" class="dropdown-content">
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <a href="#">Link 3</a>
        </div>
      </div>
      <button type="button" class="btn actionbtn" v-on:click="logout()">
        Log out
      </button>
    </div>

  </div>
</template>


<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        user: null
      }
    },
    mounted: function () {
      // Get the logged in user
      this.getUser();
      this.closeDropdownsOnClickOff();
    },
    methods: {

      toggleBuyingDropdown: function () {
        document.getElementById("buyingDropdown").classList.toggle("show");
      },

      // Close dropdowns if the user clicks outside them
      closeDropdownsOnClickOff: function() {


        function closeAllDropdownsButOne(dropdownToNotClose) {
          let dropdowns = document.getElementsByClassName("dropdown-content");
          for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show') && openDropdown.id !== dropdownToNotClose) {
              openDropdown.classList.remove('show');
            }
          }


        };
        window.onclick = function(event) {

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

      toggleSellingDropdown: function () {
        document.getElementById("sellingDropdown").classList.toggle("show");
      },

      getUser: function () {
        return "";
      },

      openRegisterPage: function () {
        alert("Register not yet implemented.");
      },

      logout: function () {
        alert("Logout not yet implemented.");
      }
    }
  }
</script>

<style scoped>

</style>
