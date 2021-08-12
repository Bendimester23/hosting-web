<template>
  <v-card class="product-card" elevation="6" outlined shaped>
    <img :src="product.image" :alt="`${product.name} képe`" />
    <h3>{{ product.name }}</h3>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: `ProuctCard`,
  props: {
    product: Object,
  },
});
</script>

<style lang="scss">
.product-card {
  margin: 10px !important;
  max-width: 300px;
  min-height: 450px;
  padding: 0px !important;
  img {
    width: 100%;
  }
}
</style>
