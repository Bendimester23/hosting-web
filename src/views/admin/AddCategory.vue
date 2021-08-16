<template>
  <div class="category-container">
    <div class="header">
      <h1>Kategóriák:</h1>
      <v-btn icon @click="refresh()" :disabled="!allowRefresh">
        <v-icon :style="`color: ${refreshColor} !important; caret-color: ${refreshColor} !important;`">mdi-refresh</v-icon>
      </v-btn>
    </div>
    <div class="categories">
      <CategoryCard v-for="c in category" v-bind:key="c.id" :category="c" />
      <v-btn class="add-category">
          <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CategoryCard from "@/components/admin/CategoryCard.vue";

export default Vue.extend({
  name: `AddCategory`,
  components: {
    CategoryCard,
  },
  computed: {
    isLoggedIn: function (): boolean {
      return this.$store.state.login.loggedIn;
    },
    category: function (): object[] {
      return this.$store.state.categories;
    },
    refreshColor: function (): string {
        return this.refreshError ? `#e74c3c` : `currentColor`;
    }
  },
  watch: {
    isLoggedIn: function (val) {
      if (!val) this.$router.push({ path: "/login" });
    },
  },
  async mounted() {
    this.$store.dispatch(`fetchCategories`, false);
  },
  data: () => ({
    allowRefresh: true,
    refreshError: false
  }),
  methods: {
    refresh() {
      this.allowRefresh = false;
      this.$store.dispatch(`fetchCategories`, true).then(() => {
        this.allowRefresh = true;
        this.refreshError = false;
      })
      .catch(() =>  {
          this.refreshError = true;
          setTimeout(() => this.allowRefresh = true, 3000)
          setTimeout(() => this.refreshError = false, 5000)
      })
    },
  },
});
</script>

<style lang="scss">
@import "../../colors.scss";

.category-container {
  min-height: 100%;
  background-color: $panel-color;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    flex-direction: row;
    button {
      margin-top: 8px;
      .error-icon-color {
          color: #e74c3c !important;
          caret-color: #e74c3c !important;
      }
    }
    h1 {
      padding-left: 10px;
    }
    margin-bottom: 10px;
  }
  .categories {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .add-category {
      display: flex;
      flex-direction: column;
      width: 250px;
      height: 330px;
      margin: 5px;
      padding: 5px;
      justify-content: center;
      align-items: center;
      .v-icon {
        font-size: 100px;
      }
    }
  }
}
</style>
