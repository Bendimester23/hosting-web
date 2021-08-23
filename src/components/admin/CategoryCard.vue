<template>
  <v-card class="category-card" :loading="isLoading">
    <!--Loader-->
    <template slot="progress">
      <v-progress-linear
        class="card-progressbar"
        color="blue"
        height="5"
        indeterminate
      ></v-progress-linear>
    </template>

    <div class="mainContent">
      <div v-if="!isEditing">
        <h2>{{ currentData.name }}</h2>
        <p class="cat-card-desc">{{ currentData.description }}</p>
      </div>
      <v-form v-model="valid" lazy-validation v-else>
        <v-text-field
          outlined
          label="Kategória neve"
          v-model="newData.name"
          :rules="nameRules"
        ></v-text-field>
        <v-textarea
          outlined
          label="Kategóriat leírása"
          v-model="newData.description"
          :rules="descriptionRules"
          height="100px"
        ></v-textarea>
        <v-checkbox label="Rejtett" v-model="newData.hidden"></v-checkbox>
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

        <div class="normalIcons" v-if="!isEditing">
          <v-btn icon @click="startEditing()">
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
          <v-btn icon @click="deleteCategory()">
            <v-icon class="delete-icon"> mdi-delete </v-icon>
          </v-btn>
        </div>

        <div class="editingIcons" v-else>
          <v-btn icon class="save-icon" @click="saveEdit()" :disabled="!valid">
            <v-icon> mdi-check-circle-outline </v-icon>
          </v-btn>
          <v-btn icon @click="cancelEdit()">
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
  name: `CategoryCard`,
  props: {
    category: Object,
  },
  data: () => ({
    isEditing: false,
    newData: {
      name: ``,
      description: ``,
      hidden: false
    },
    currentData: {
      name: ``,
      description: ``,
      hidden: false
    },
    isLoading: false,
    hasError: false,
    oldName: ``,
    nameRules: [] as any[],
    descriptionRules: [] as any[],
    valid: true
  }),
  methods: {
    startEditing() {
      this.isEditing = true;
      this.newData = this.category;
      this.oldName = this.newData.name;
    },
    cancelEdit() {
      this.newData = this.currentData;
      this.isEditing = false;
      console.log(`Cancel`);
    },
    saveEdit() {
      if (!this.valid) return
      this.currentData = this.newData;
      this.cancelEdit();
      this.isLoading = true;
      this.$store
        .dispatch(`editCategory`, {
          name: this.currentData.name,
          description: this.currentData.description,
          oldName: this.oldName,
          hidden: this.currentData.hidden
        })
        .then(() => {
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
          this.hasError = true;
        });
    },
    deleteCategory() {
      this.cancelEdit();
      this.$store
        .dispatch(`deleteCategory`, this.currentData.name)
        .then(() => this.cancelEdit())
        .catch(() => (this.hasError = true));
    },
  },
  mounted() {
    this.currentData = this.category;
    this.$store.dispatch(`fetchSchema`).then(() => {
      const cSchema = this.$store.state.schema.category;
      this.nameRules = [
        (v: string) => !!v || `Kötelező megadni!`,
        (v: string) =>
          v.length >= cSchema.name.min ||
          `Legalább ${cSchema.name.min} karakternek lehet!`,
        (v: string) =>
          v.length <= cSchema.name.max ||
          `Legfeljebb ${cSchema.name.max} karakter lehet!`,
      ];

      this.descriptionRules = [
        (v: string) => !!v || `Kötelező megadni!`,
        (v: string) =>
          v.length >= cSchema.description.min ||
          `Legalább ${cSchema.description.min} karakternek lehet!`,
        (v: string) =>
          v.length <= cSchema.description.max ||
          `Legfeljebb ${cSchema.description.max} karakter lehet!`,
      ];
    });
  },
});
</script>

<style lang="scss">
.errorIcon {
  display: flex;
  align-items: center;
}

.cat-card-desc {
  white-space: pre-wrap !important;
}

.category-card {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 330px;
  margin: 5px;
  padding: 0;
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
