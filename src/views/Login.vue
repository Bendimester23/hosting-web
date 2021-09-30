<template>
  <div class="login">
    <div class="form-container">
      <h1>Bejelentkezés</h1>
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
            v-model="password"
            :rules="passwordRules"
            filled
            color="#000000"
            label="Jelszó"
            type="password"
        ></v-text-field>

      </v-form>

      <div class="buttons">
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="login">
          Bejelentkezés
        </v-btn>

        <v-spacer/>

        <v-btn color="#afafaf" @click="toRegister">
          Regisztráció
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Login",
  data: function () {
    return {
      valid: true,
      name: "",
      nameRules: [] as any[],
      password: "",
      passwordRules: [] as any[]
    };
  },
  methods: {
    login() {
      (this.$refs.form as any).validate();
      console.log(this.$store.dispatch)
      this.$store
          .dispatch("auth/login", {
            username: this.name,
            password: this.password,
          })
          .then(() => {
            if (this.$route.query.redirect != undefined) {
              this.$router.push({path: this.$route.query.redirect as string});
            } else {
              this.$router.push({path: `/dashboard`});
            }
          })
          .catch((e: Error) => {
            console.log(e);

            if (e.name.includes(`Login failed!`) || e.message.includes(`Login failed!`) || e.message.includes(`status code`)) {
              this.$store.commit(`triggerError`, `Helytelen felhasználónév vagy jelszó!`)
            } else {
              this.$store.commit(`triggerError`, `Hiba történt!`)
            }
            this.name = ``;
            this.password = ``;
          });
    },
    toRegister() {
      this.$router.push({path: `/register`})
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
          this.passwordRules = [
            (v: string) => !!v || `Kötelező megadni`,
            (v: string) => (v && v.length >= schema.password.min) || `Legalább ${schema.password.min} karakternek lehet!`,
            (v: string) => (v && v.length <= schema.password.max) || `Legfeljebb ${schema.password.max} karakternek lehet!`,
          ];
        })
        .catch(() => {
          this.$store.commit(`triggerError`, `Nem sikerült csatlakozni a szerverhez!`)
        })

  }
});
</script>

<style lang="scss">
.login {
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

    h1 {
      margin-bottom: 45px;
      text-align: center;
    }

    .buttons {
      display: flex;
      flex-direction: row;
    }
  }
}

@media screen and (max-width: 700px) {
  .login {
    .form-container {
      min-width: 90%;
    }
  }
}
</style>