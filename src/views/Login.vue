<template>
  <div class="login">
    <div class="form-container">
      <h1>Bejelentkezés</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          filled
          color="#000"
          label="Felhasználónév"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          filled
          color="#000"
          label="Jelszó"
          type="password"
        ></v-text-field>

        <v-btn :disabled="!valid" color="success" class="mr-4" @click="login">
          Bejelentkezés
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Login",
  data: function() {
    return {
      valid: true,
      name: "",
      nameRules: [
        (v: any) => !!v || "Name is required",
        (v: any) =>
          (v && v.length >= 6) || "Name must be less than 10 characters"
      ],
      password: "",
      passwordRules: [
        (v: any) => !!v || "A jelszót meg kell adnod",
        (v: any) =>
          (v && v.length >= 6) || "Name must be less than 10 characters"
      ]
    };
  },
  methods: {
    login() {
      (this.$refs.form as any).validate();
      this.$store.dispatch("login", {
        username: this.name,
        password: this.password
      });
    }
  },
  computed: {
    isLoggedIn: function(): boolean {
      return this.$store.state.login.loggedIn;
    }
  },
  watch: {
      isLoggedIn: function (val) {
          if (val) this.$router.push({ path: "/dashboard" });
      }
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