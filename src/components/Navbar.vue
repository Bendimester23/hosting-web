<template>
  <div
    class="navbar"
    v-bind:class="{ navbarActive: showDraver, navbarHiding: hiding }"
  >
    <div class="branding" v-on:click="clickBtn(0)">
      <img
        src="https://media.discordapp.net/attachments/738853555393265718/788006317553221652/MLG-Host_LOGO.png"
        alt="logo"
        class="brandLogo"
      />
      <p class="brandName">MLGHost</p>
    </div>
    <v-spacer :v-if="!showDrawer"></v-spacer>
    <div class="btnGroup" :v-if="showDrawer">
      <v-btn elevation="0" v-on:click="clickBtn(0)">Főoldal</v-btn>
      <v-btn elevation="0" v-on:click="clickBtn(1)">Szolgáltatásaink</v-btn>
      <v-btn elevation="0" v-on:click="clickBtn(2)">Panel</v-btn>
      <v-btn elevation="0" v-on:click="clickBtn(3)"
        >{{isLoggedIn? username : 'Bejelentkezés'}}</v-btn
      >
    
      <v-btn elevation="0" v-on:click="clickBtn(4)" class="cart"
        ><v-icon>mdi-cart</v-icon>
        <v-badge class="badge" color="rgba(0,0,0,0)"
          ><p>{{ cartItems }}</p></v-badge
        ></v-btn
      >
    </div>
    <div class="showNav">
      <v-btn elevation="0" v-on:click="toggleBtns()">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Navbar",
  data: function() {
    return {
      mobileNavOpen: false,
      hiding: false,
      width: window.innerWidth,
      showUserDropdow: false
    };
  },
  computed: {
    showDraver: function(): boolean {
      if (this.width <= 700) return this.mobileNavOpen;
      return true;
    },
    cartItems: function(): number {
      return this.$store.state.cart.size;
    },
    isLoggedIn: function(): boolean {
      return this.$store.state.login.loggedIn;
    },
    username: function(): string {
      return this.$store.state.login.username;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    toggleBtns() {
      this.$data.mobileNavOpen = !this.$data.mobileNavOpen;
      if (!this.mobileNavOpen) {
        this.hiding = true;
        setTimeout(() => (this.hiding = false), 500);
      }
    },
    clickBtn(id: number) {
      switch (id) {
        case 0:
          this.$router.push("/");
          break;
        case 1:
          this.$router.push("/services");
          break;
        case 2:
          window.open("https://panel.mlghost.hu", "_blank");
          break;
        case 3:
          if (this.isLoggedIn) this.showUserDropdow = !this.showUserDropdow;
          else this.$router.push("/login");
          break;
        case 4:
          this.$router.push("/cart");
          break;
      }
      this.toggleBtns();
    },
    onResize() {
      this.width = window.innerWidth;
    }
  }
});
</script>

<style lang="scss">
@import "../colors.scss";

.navbar {
  background-color: $navbar-color;
  height: 50px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  max-height: 290px;
  overflow: hidden;
  .branding {
    display: inline-flex;
    flex-direction: row;
    cursor: pointer;
    margin-right: -40px;
    .brandLogo {
      display: inline-flex;
      width: 50px;
      height: 50px;
    }
    .brandName {
      display: inline-flex;
      color: $navbar-text-color;
      font-weight: 800;
      font-size: 25px;
      margin-top: 8px;
      margin-left: 10px;
      padding: 0px;
    }
  }
  .btnGroup {
    display: inline-flex;
    justify-content: center;
    button {
      margin-top: 6px;
      margin-right: 5px;
      color: $navbar-text-color;
      background-color: $navbar-color !important;
    }
    .cart {
      .badge {
        z-index: 100;
        p {
          z-index: 200;
        }
      }
    }
  }
  .showNav {
    button {
      background-color: $navbar-color !important;
      color: $navbar-text-color;
      margin-top: 6px;
      margin-right: 5px;
    }
    display: none;
    margin-left: -10px;
  }
}

@keyframes showNav {
  from {
    height: 50px;
  }

  to {
    height: 280px;
  }
}

@keyframes hideNav {
  from {
    height: 280px;
  }

  to {
    height: 50px;
  }
}

@media screen and (max-width: 700px) {
  .btnGroup {
    flex-direction: column;
    margin-top: 155px;
    margin-right: 20%;
    flex-grow: 3;
    justify-content: flex-end !important;
    height: 110px;
    z-index: 999;
  }

  .navbarHiding {
    animation-name: hideNav;
    animation-duration: 0.5s;
  }

  .navbarActive {
    height: 280px;
    animation-name: showNav;
    animation-duration: 0.5s;
  }
  .showNav {
    display: block !important;
  }
}
</style>
