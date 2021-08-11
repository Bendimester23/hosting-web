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
.card {
        margin-right: 1%;
        max-width: 350px;
        min-height: 210px;
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
          }
        }
        .card-icon {
          display: flex;
          justify-self: center;
          font-size: 50px;
          margin-top: 10px;
        }
      }
</style>
