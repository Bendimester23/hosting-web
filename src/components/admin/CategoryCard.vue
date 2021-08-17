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
      <div v-else>
        <v-text-field
          outlined
          label="Kategória neve"
          v-model="newData.name"
        ></v-text-field>
        <v-textarea
          outlined
          label="Kategóriat leírása"
          v-model="newData.description"
        ></v-textarea>
      </div>

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
          <v-btn icon class="save-icon" @click="saveEdit()">
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
    },
    currentData: {
      name: ``,
      description: ``,
    },
    isLoading: false,
    hasError: false,
    oldName: ``,
    nameRules: [],
    descriptionRules: []
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
      this.currentData = this.newData;
      this.cancelEdit();
      this.isLoading = true;
      this.$store
        .dispatch(`editCategory`, {
          name: this.currentData.name,
          description: this.currentData.description,
          oldName: this.oldName,
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
      this.$store.dispatch(`deleteCategory`, this.currentData.name)
      .then(() => this.cancelEdit())
      .catch(() => this.hasError = true);
    }
  },
  mounted() {
    this.currentData = this.category;
    this.$store.dispatch(`fetchSchema`)
    .then(() => {
      const schema = this.$store.state.schema;
      
    })
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

.category-card {
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
