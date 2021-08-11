<template>
    <v-card elevation="6" outlined shaped class="card">
          <v-icon class="card-icon">{{d.icon}}</v-icon>
          <v-card-title class="card-title"
            ><p>{{d.name}}</p></v-card-title
          >
          <v-card-text class="card-desc"
            >{{d.description}}</v-card-text
          >
        </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: "FeatureCard",
    props: {
        d: Object
    }
})
</script>

<style lang="scss">
@import "../colors.scss";

.card {
        margin-right: 1%;
        max-width: 350px !important;
        min-height: 210px;
        background-color: $feature-card-bg !important;
        .card-title {
          margin-bottom: -5px;
          margin-top: -5px;
          padding-top: 0px;
          justify-content: center;
          align-content: center;
          p {
            margin-top: 15px;
            font-size: 30px;
            text-align: center;
            color: $feature-card-title !important;
          }
        }
        .card-icon {
          display: flex;
          justify-self: center;
          font-size: 50px;
          margin-top: 10px;
          color: $feature-card-icon !important;
        }
        .card-desc {
            color: $feature-card-text !important;
        }
      }
</style>
