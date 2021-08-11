<template>
  <div class="footer">
    <h1>Kapcsolat:</h1>
    <ul>
      <li v-if="l.footer.website != ``">
        <v-icon>mdi-web</v-icon>Weboldal: 
        <a :href="`https://${l.footer.website}`"> {{l.footer.website}}</a>
      </li>
      <li v-if="l.footer.discord != ``">
        <v-icon>mdi-discord</v-icon>Discord: 
        <a :href="`https://${l.footer.discord}`"> {{l.footer.discord}}</a>
      </li>
      <li v-if="l.footer.email != ``">
        <v-icon>mdi-email</v-icon>E-mail: 
        <a :href="`mailto:${l.footer.email}`">{{l.footer.email}}</a>
      </li>
      <li v-if="l.footer.phone != ``">
        <v-icon>mdi-phone</v-icon>Telefonszám: 
        <a>{{l.footer.phone}}</a>
      </li>
    </ul>
    <v-divider></v-divider>
    <p class="copyright">&copy;{{new Date().getFullYear()}} {{l.appName}}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import l from '@/locale.json'

export default Vue.extend({
  name: "Footer",
  data: () => ({
    l
  })
});
</script>

<style lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  background-color: #353b48;
  color: #fff;
  justify-content: center;
  float: bottom;
  h1 {
    text-align: center;
    font-weight: 400;
    font-size: 40px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  ul {
    display: flex;
    justify-content: center;
    list-style-type: none;
    flex-direction: column;
    padding-bottom: 15px;
    li {
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      margin-bottom: 10px;
    }
  }
  .copyright {
    text-align: center;
    margin-top: 3px;
    margin-bottom: 3px;
    color: rgba($color: #fff, $alpha: 0.8);
  }
}
</style>
