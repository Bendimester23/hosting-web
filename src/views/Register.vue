<template>
  <div class="login">
    <div class="form-container">
      <h1>Regisztráció</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
            v-model="name"
            :rules="nameRules"
            filled
            color="#000000"
            label="Felhasználónév"
            required
        ></v-text-field>

        <v-text-field
            v-model="email"
            :rules="emailRules"
            filled
            color="#000000"
            label="E-mail cím"
            required
        ></v-text-field>

        <v-text-field
            v-model="password"
            :rules="passwordRules"
            filled
            color="#000000"
            label="Jelszó"
            type="password"
        ></v-text-field>

        <v-text-field
            v-model="password2"
            :rules="password2Rules"
            filled
            color="#000000"
            label="Jelszó újra"
            type="password"
        ></v-text-field>

        <VueHcaptcha sitekey="0e1116b4-2234-41ef-8811-6b2c6964090d" ref="captcha" @verify="verify"></VueHcaptcha>

      </v-form>

      <div class="buttons">
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="register" :loading="loading">
          Regisztráció
        </v-btn>

        <v-spacer/>

        <v-btn color="#afafaf" @click="toLogin">
          Bejelentkezés
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";

export default Vue.extend({
  name: 'Register',
  components: {
    VueHcaptcha
  },
  data: () => ({
    valid: true,
    name: "",
    nameRules: [] as any[],
    password: "",
    passwordRules: [] as any[],
    password2: "",
    password2Rules: [] as any[],
    email: ``,
    emailRules: [] as any[],
    hasCaptcha: false,
    captchaRes: ``,
    clickWithoutCaptcha: false,
    loading: false
  }),
  methods: {
    verify(token: string) {
      this.captchaRes = token;
      this.hasCaptcha = true;
      if (this.clickWithoutCaptcha) this.register();
    },
    toLogin() {
      this.$router.push({ path: `/login` })
    },
    register() {
      (this.$refs.form as any).validate();
      if (!this.valid) return
      if (!this.hasCaptcha) {
        this.clickWithoutCaptcha = true;
        (this.$refs.captcha as VueHcaptcha).execute();
        return;
      }
      this.loading = true;
      this.clickWithoutCaptcha = false;
      this.$store
          .dispatch("auth/register", {
            username: this.name,
            password: this.password,
            email: this.email,
            captcha: this.captchaRes
          })
          .then((v) => {
            this.loading = false;
            if (v) this.$router.push({ path: `/verifyEmail`, query: { email: this.email } });
            else {
              if (this.$route.query.redirect != undefined) {
                this.$router.push({ path: this.$route.query.redirect as string });
              } else {
                this.$router.push({ path: `/dashboard` });
              }
            }
          })
          .catch(() => {
            this.name = ``;
            this.email = ``;
            this.password = ``;
            this.password2 = ``;
            this.loading = false;
          });
    }
  },
  mounted() {
    this.$store.dispatch(`fetchSchema`)
        .then(() => {
          const schema = this.$store.state.schema;
          this.nameRules = [
            (v: string) => !!v || `Kötelező megadni`,
            (v: string) => (v && v.length >= schema.username.min) || `Legalább ${schema.username.min} karakternek lehet!`,
            (v: string) => (v && v.length <= schema.username.max) || `Legfeljebb ${schema.username.max} karakternek lehet!`,
          ];
          this.emailRules = [
            (v: string) => !!v || `Kötelező megadni`,
            (v: string) => (v && v.length >= schema.username.min) || `Legalább ${schema.email.min} karakternek lehet!`,
            (v: string) => (v && v.length <= schema.username.max) || `Legfeljebb ${schema.email.max} karakternek lehet!`,
            // eslint-disable-next-line no-useless-escape
            (v: string) => v.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) || `Helytelen e-mail cím!`
          ];
          this.passwordRules = [
            (v: string) => !!v || `Kötelező megadni`,
            (v: string) => (v && v.length >= schema.password.min) || `Legalább ${schema.password.min} karakternek lehet!`,
            (v: string) => (v && v.length <= schema.password.max) || `Legfeljebb ${schema.password.max} karakternek lehet!`,
          ];
          this.password2Rules = [
            (v: string) => !!v || `Kötelező megadni`,
            (v: string) => (v && v.length >= schema.password.min) || `Legalább ${schema.password.min} karakternek lehet!`,
            (v: string) => (v && v.length <= schema.password.max) || `Legfeljebb ${schema.password.max} karakternek lehet!`,
            (v: string) => v == this.password || `A két jelszó nem egyezik!`,
          ];
        })
        .catch(() => {
          this.$store.commit(`triggerError`, `Nem sikerült csatlakozni a szerverhez!`)
        })

  }
})
</script>