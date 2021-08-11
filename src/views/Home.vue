<template>
  <div class="home">
    <div class="landing">
      <h1 v-bind:class="{blackTxt: l.titleBlack}">{{l.appName}}</h1>
      <br />
      <h3 v-bind:class="{blackTxt: l.catchPhraseBlack}">
        {{l.catchPhrase}}
      </h3>
    </div>
    <div class="features">
      <h2>{{l.features.title}}</h2>
      <h4>
        {{l.features.description}}
      </h4>
      <div class="cards-container">
        <FeatureCard :d="l.features.cards[0]"/>
        <FeatureCard :d="l.features.cards[1]"/>
        <FeatureCard :d="l.features.cards[2]"/>
        
      </div>
    </div>
    <div class="p-div"></div>
    <div class="newsletter">
      <h2>Iratkozz fel hírlevelünkre!</h2>
      <div class="form-container">
        <v-text-field label="E-Mail" solo class="email"></v-text-field>
        <v-btn elevation="3" class="sub">Feliratkozás</v-btn>
      </div>
    </div>
    <div class="p-div-a"></div>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Footer from '@/components/Footer.vue';
import FeatureCard from '@/components/FeatureCard.vue';
import locale from '../locale.json';

export default Vue.extend({
  name: "Home",
  components: {
    Footer,
    FeatureCard
  },
  data: () => {
    return {
      l: locale
    };
  }
});
</script>

<style lang="scss">
.blackTxt {
  color: #000000 !important;
}

.home {
  display: flex;
  flex-direction: column;
  margin: 0px;
  .landing {
    display: inline-flex;
    height: 500px;
    overflow: hidden;
    background-image: url("../assets/landing.png");
    background-size: cover;
    background-attachment: fixed;
    flex-direction: column;
    padding: 0px;
    margin: 0px;
    width: 100%;
    z-index: 100;
    align-content: center;
    justify-content: center;
    h1 {
      text-align: center;
      font-size: 45px;
      color: #fff;
    }
    h3 {
      text-align: center;
      font-weight: 200;
      color: rgba(250, 250, 250, 0.8);
    }
  }

  .features {
    margin: 0px;
    padding: 5px;
    display: flex;
    min-height: 600px;
    flex-direction: column;
    background-color: #92e9f5;
    h4 {
      text-align: center;
      font-weight: 400;
    }
    h2 {
      font-weight: 600;
      font-size: 40px;
      text-align: center;
    }
    align-content: center;
    padding-top: 55px;
    .cards-container {
      margin-top: 85px;
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
    }
  }

  .p-div {
    display: flex;
    background-image: url("../assets/parallax.jpg");
    background-size: cover;
    background-attachment: fixed;
    height: 400px;
  }

  .p-div-a {
    display: flex;
    background-image: url("../assets/parallax2.png");
    background-size: cover;
    background-attachment: fixed;
    height: 400px;
  }

  .newsletter {
    display: flex;
    flex-direction: column;
    height: 200px;
    background-color: #92e9f5;
    h2 {
      margin: 15px;
      text-align: center;
      margin-bottom: 25px;
    }
    .form-container {
      display: flex;
      flex-direction: row;
      margin-left: 20px;
      margin-right: 20px;
      .email {
        margin-right: 15px;
      }
      .sub {
        margin-top: 6px;
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .home {
    .features {
      .cards-container {
        flex-direction: column !important;
        justify-content: center !important;
        .card {
          justify-self: center;
          margin-left: 5px !important;
          margin-right: 5px !important;
          max-width: 700px;
          margin-bottom: 10px;
        }
      }
    }
    .newsletter {
      .form-container {
        flex-direction: column !important;
        .email {
          margin-bottom: 0px !important;
          padding-bottom: 0px !important;
          margin-right: 0px !important;
        }
        .sub {
          margin-top: -10px !important;
          margin-bottom: 15px !important;
        }
      }
    }
  }
}
</style>
