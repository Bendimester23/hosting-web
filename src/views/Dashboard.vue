<template>
  <div class="dashboard">
    <h1>Menü</h1>
    <p>Felhasználónév: {{ username }}!</p>
    <div class="normal-btns">
      <v-btn-toggle>
        <v-btn @click="logout()">Kilépés</v-btn>
      </v-btn-toggle>
    </div>
    <div class="admin" v-if="isAdmin">
      <h1>Admin panel</h1>
      <div class="btns">
      <v-btn-toggle>
        <v-btn @click="setCurrentPage(`/admin/category`)">Kategóriák</v-btn>
        <v-btn @click="setCurrentPage(`/admin/product`)"> Termékek </v-btn>
      </v-btn-toggle>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Dashboard",
  computed: {
    username: function (): string {
      return this.$store.getters[`auth/getUsername`];
    },
    isAdmin: function (): boolean {
      return this.$store.getters[`auth/isAdmin`];
    }
  },
  methods: {
    setCurrentPage(page: string) {
      this.$router.push({ path: page });
    },
    logout() {
      this.$store.dispatch(`auth/logout`)
      this.$router.push({ path: `/login` })
    }
  },
});
</script>

<style lang="scss">
@import "../colors.scss";

.dashboard {
  background-color: $panel-color;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 5px;
  .admin {
    display: flex;
    flex-direction: column;
    .btns {
      display: flex;
      flex-direction: row;
    }
    h1 {
      margin-bottom: 5px;
    }
  }
}
</style>
