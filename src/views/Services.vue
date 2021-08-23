<template>
  <div class="services">
    <div class="landing-div">
      <h1>Szolgáltatásaink: </h1>
      <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. </h2>
    </div>
    <div class="services-container">
      <div v-for="c in $store.state.categories" v-bind:key="c.id">
        <h1>{{c.name}}</h1>
        <p>{{c.description}}</p>
        <i v-if="c.hidden">Rejtett</i>
        <h4>Nincs termék a kategóriában.</h4>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Footer from '@/components/Footer.vue'

export default Vue.extend({
  name: 'Services',
  data: () => ({
    products: [
      {
        _id: `DHFghGFhfgJg46FDhf`,
        name: `EPiK Szerver 2000`,
        description: `Egy naon epikk szerver, ami naon jó is.`,
        features: [
          `Naon gyors`,
          `Néha fut`,
          `Ezek csak random hülyeségek`,
          `És módosíthatóak`,
          `Nyomokban mókusokat tartalmazhat`
        ],
        notIncluded: [
          `Ablakokat nem tartalmaz`
        ],
        image: `http://lng.sourceforge.net/mr_lu2.png`,
        price: {
          amount: 69,
          currency: `USD`
        },
        stock: -1
      }
    ]
  }),
  components: {
    Footer
  },
  mounted() {
      this.$store.dispatch(`fetchCategories`, false);

  }
})
</script>

<style lang="scss">
@import "../colors.scss";

.services {
  display: flex;
  flex-direction: column;

  .landing-div {
    display: flex;
    flex-direction: column;
    height: 70vh;
    text-align: center;
    align-items: center;
    justify-content: center;
    background-image: url('../assets/landing.webp');
    background-size: cover;
    background-attachment: fixed;
    color: #fff;
  }

  .services-container {
    background-color: $panel-color;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 5px;
    div {
      p {
        white-space: pre-wrap;
      }
      margin-bottom: 10px;
    }
  }
}
</style>
