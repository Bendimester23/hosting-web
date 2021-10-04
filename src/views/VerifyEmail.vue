<template>
  <div class="verify">
    <div class="form-container">
      <div v-if="!verified">
        <h1>E-mail cím megerősítése</h1>
        <p>A kódot a <b>{{ $route.query.email }}</b> címre küldött levélben találod.</p>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
              v-model="code"
              :rules="codeRules"
              filled
              color="#000000"
              label="Kód"
              required
          ></v-text-field>

          <v-spacer></v-spacer>

          <v-btn :disabled="!valid" color="primary" width="100%" class="submit-btn" @click="verify" :loading="loading">Megerősítés</v-btn>
        </v-form>
      </div>
      <diy v-else>
        <h1>E-mail cím megerősítve!</h1>
        <p>Mostmár beléphetsz.</p>
        <v-btn @click="toLogin">Bejelentkezés</v-btn>
      </diy>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from 'axios'
import {API_URL} from "@/store/login";

export default Vue.extend({
  name: "VerifyEmail",
  data: () => ({
    valid: false,
    code: ``,
    verified: false,
    loading: false,
    codeRules: [
      (v: string) => !!v || `Kötelező megadni`,
      (v: string) => v.match(/\d{6}/g) || `6 darab számot kell tartalmaznia`
    ]
  }),
  methods: {
    async verify() {
      this.loading = true
      try {
        const { status } = await axios.get(`${API_URL}/auth/verify/${this.$route.query.email}/${this.code}`)
        switch (status) {
          case 404:
            this.$store.commit(`triggerError`, `A fiókot már hitelesítették, vagy nem létezik`)
            break
          case 400:
            this.$store.commit(`triggerError`, `Hibás kód`)
            break
          case 500:
            this.$store.commit(`triggerError`, `Belső szerverhiba`)
            break
          default:
            this.verified = true
        }
      } catch (e) {
        this.$store.commit(`triggerError`, `Hiba történt a megerősítés közben`)
      }
      this.loading = false
    },
    toLogin() {
      this.$router.push({ path: `/login` })
    }
  }
})
</script>

<style lang="scss">
.verify {
  display: flex;
  background-image: url("../assets/parallax2.png");
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
  align-items: center;
  justify-content: center;

  .form-container {
    background-color: #f5f6fa;
    border-radius: 10px;
    min-width: 550px;
    padding: 15px;

    .submit-btn {
      margin-top: 25px;
    }
  }
}
</style>