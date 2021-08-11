<template>
  <div class="footer">
    <h1>Kapcsolat:</h1>
    <ul>
      <li>
        <v-icon>mdi-web</v-icon>Weboldal:
        <a href="http://mlghost.hu"> mlghost.hu</a>
      </li>
      <li>
        <v-icon>mdi-discord</v-icon>Discord:
        <a href="http://dc.mlghost.hu"> dc.mlghost.hu</a>
      </li>
      <li>
        <v-icon>mdi-email</v-icon>E-mail:
        <a href="mailto:support@mlghost.hu">support@mlghost.hu</a>
      </li>
    </ul>
    <v-divider></v-divider>
    <p class="copyright">&copy;2021 MLGHost</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Footer"
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
    font-size: 50px;
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
