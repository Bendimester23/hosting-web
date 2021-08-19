<template>
  <v-card class="add-category-form" v-click-outside="tryCancel" :loading="loading">
    <template slot="progress">
      <v-progress-linear
        class="card-progressbar"
        color="blue"
        height="5"
        indeterminate
      ></v-progress-linear>
    </template>

    <div class="mainContent">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          outlined
          label="Kategória neve"
          :rules="nameRules"
          v-model="name"
        ></v-text-field>
        <v-textarea
          outlined
          label="Kategóriat leírása"
          v-model="description"
          :rules="descriptionRules"
        ></v-textarea>
      </v-form>

      <v-spacer></v-spacer>

      <div class="icon-container">
        <v-spacer></v-spacer>
        <v-tooltip bottom v-if="hasError">
          <template v-slot:activator="{ on, attrs }">
            <div class="errorIcon" v-bind="attrs" v-on="on">
              <v-icon color="#e74c3c">mdi-alert-box-outline</v-icon>
            </div>
          </template>
          <span>Hiba történt a mentés közben!</span>
        </v-tooltip>

        <div class="editingIcons">
          <v-btn icon class="save-icon" @click="save()" :disabled="!valid">
            <v-icon> mdi-check-circle-outline </v-icon>
          </v-btn>
          <v-btn icon @click="cancel()">
            <v-icon class="delete-icon"> mdi-close-circle-outline </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: `AddCategoryCard`,
  data: () => ({
    name: ``,
    description: ``,
    nameRules: [] as any[],
    descriptionRules: [] as any[],
    valid: false,
    loading: false,
    hasError: false
  }),
  methods: {
    cancel() {
      this.hasError = true;
      this.$store.commit(`setAddingCategory`, false);
    },
    tryCancel() {
      if (this.name == `` && this.description == ``) {
        this.cancel();
      }
    },
    save() {
      (this.$refs.form as any).validate()
      if (!this.valid) return
      this.loading = true
      this.$store.dispatch(`addCategory`, {
        name: this.name,
        description: this.description
      })
      .then(() => {
        this.loading = false;
        this.cancel();
      })
      .catch(() => {
        this.loading = false;
        this.cancel();
        this.hasError = true;
      })
    }
  },
  mounted() {
    const category = this.$store.state.schema.category;
    this.nameRules = [
      (v: string) => !!v || `Kötelező megadni!`,
      (v: string) =>
        v.length >= category.name.min ||
        `Legalább ${category.name.min} karakternek lehet!`,
      (v: string) =>
        v.length <= category.name.max ||
        `Legfeljebb ${category.name.max} karakter lehet!`,
    ];

    this.descriptionRules = [
      (v: string) => !!v || `Kötelező megadni!`,
      (v: string) =>
        v.length >= category.description.min ||
        `Legalább ${category.description.min} karakternek lehet!`,
      (v: string) =>
        v.length <= category.description.max ||
        `Legfeljebb ${category.description.max} karakter lehet!`,
    ];
  },
});
</script>

<style lang="scss">
.errorIcon {
  display: flex;
  align-items: center;
}

.cat-card-desc {
  white-space: pre;
}

.add-category-form {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 300px;
  width: fit-content;
  height: 330px;
  margin: 5px;
  padding: 0px;
  overflow: hidden;
  .mainContent {
    padding: 5px;
    display: flex;
    flex-direction: column;
    height: 100% !important;
    .icon-container {
      display: flex;
      .delete-icon:hover {
        color: #e74c3c !important;
        caret-color: #e74c3c !important;
      }
      .save-icon:hover {
        color: #2ecc71 !important;
        caret-color: #2ecc71 !important;
      }
    }
  }
}
</style>
