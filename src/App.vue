<template>
  <v-app>
    <navbar/>
    <v-main>  
      <router-view/>
    </v-main>
    <v-snackbar v-model="$store.state.error.has">
      {{$store.state.error.text}}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" icon v-bind="attrs" @click="$store.commit(`closeError`)">
          <v-icon>
            mdi-close-circle-outline
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
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
  }),
  mounted() {
    if (localStorage.getItem(`token`) != undefined) {
      this.$store.dispatch(`refresh`, localStorage.getItem(`token`))
      .then(() => {
        if (redirectToDashboard) this.$router.push({ path: `/dashboard` })
      })
      .catch(() => {
        this.$router.push({ path: `/login` })
        this.$store.commit(`triggerError`, `A munkameneted lejárt!`)
        this.$store.dispatch(`logOut`);
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
