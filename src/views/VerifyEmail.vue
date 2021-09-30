<template>
  <div class="verify">
    <div class="form-container">
      <h1>E-mail cím megerősítése</h1>
      <p>A kódot a {{$route.query.email}} címre küldött levélben találod.</p>
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

        <v-btn :disabled="!valid">Megerősítés</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "VerifyEmail",
  data: () => ({
    valid: false,
    code: ``,
    codeRules: [
      (v: string) => !!v || `Kötelező megadni`,
      (v: string) => v.match(/\d{6}/g) || `6 darab számot kell tartalmaznia`
    ]
  })
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
    min-height: 310px;
    padding: 15px;
  }
}
</style>