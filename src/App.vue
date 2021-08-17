<template>
  <v-app>
    <navbar/>
    <v-main>  
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from '@/components/Navbar.vue'
import { redirectToDashboard } from './locale.json'

export default Vue.extend({
  name: 'App',

  components: {
    Navbar
  },

  data: () => ({
    //
  }),
  mounted() {
    if (localStorage.getItem(`token`) != undefined) {
      this.$store.dispatch(`refresh`, localStorage.getItem(`token`))
      .then(() => {
        if (redirectToDashboard) this.$router.push({ path: `/dashboard` })
      })
      .catch(() => {
        this.$router.push({ path: `/login` })
      })
    }
  }
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;800&display=swap');
* {
  font-family: 'Nunito';
}

body{
  padding:0;
  margin:0;
  overflow-x: hidden;
}
</style>
