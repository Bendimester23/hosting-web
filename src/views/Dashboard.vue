<template>
  <div class="dashboard">
    <h1>Menü</h1>
    <p>Hello, {{username}}!</p>
    <div class="admin" v-if="$store.state.login.isAdmin">
      <h1>Admin panel</h1>
      <v-btn>Kategória hozzáadása</v-btn>
      <v-btn>Termék hozzáadása</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Dashboard",
  computed: {
    isLoggedIn: function(): boolean {
      return this.$store.state.login.loggedIn;
    },
    username: function(): string {
      return this.$store.state.login.username;
    }
  },
  watch: {
    isLoggedIn: function(val) {
      if (!val) this.$router.push({ path: "/login" });
    }
  },
  mounted() {
    if (!this.isLoggedIn) this.$router.push({ path: "/login" });
  }
});
</script>

<style lang="scss">
</style>
