import axios from 'axios';
import Vuex from 'vuex'

import { API_URL, default as auth } from './login';
import Vue from "vue";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: {
      size: 0
    },
    categories: [],
    fetchedCategories: false,
    schema: {},
    fetchedSchema: false,
    addingCategory: false,
    error: {
      has: false,
      text: ``
    }
  },
  mutations: {
    setCategories(state: any, data: any) {
      state.categories = data.c;
      state.fetchCategories = data.f;
    },
    setSchema(state, data) {
      state.schema = data;
      state.fetchedSchema = true;
    },
    setAddingCategory(state, data) {
      state.addingCategory = data;
    },
    triggerError(state, text) {
      state.error = {
        has: true,
        text
      }
    },
    closeError(state) {
      state.error.has = false;
    }
  },
  actions: {
    async fetchCategories(store: any, force: boolean) {
      return new Promise<void>((res, rej) => {
        if (!force && store.state.fetchCategories) {
          res()
          return
        }
        axios.get(`${API_URL}/category/${store.getters[`auth/isAdmin`] ? `admin/` : ``}all`, {
          headers: {
            Authorization: store.getters[`auth/getToken`]
          }
        }).then(({ data, status }) => {
          if (status != 200) {
            store.commit(`setCategories`, {
              c: [{
                name: `Hiba!`,
                description: `Nem sikerült betölteni a ketegóriákat`
              }],
              f: false
            })
            rej();
            return
          }
          store.commit(`setCategories`, {
            c: data,
            f: true
          })
          res();
        })
          .catch((e) => {
            store.commit(`setCategories`, {
              c: [{
                name: `Hiba!`,
                description: `Nem sikerült betölteni a ketegóriákat`
              }],
              f: false
            })
            rej();
          })
      })
    },
    async editCategory(store: any, category: any) {
      return new Promise<void>((res, rej) => {
        if (!store.getters[`auth/isLoggedIn`]) {
          rej();
          return;
        }
        axios.patch(`${API_URL}/category/${category.oldName}`, {
          description: category.description,
          name: category.name,
          hidden: category.hidden
        }, {
          headers: {
            Authorization: store.getters[`auth/getToken`]
          }
        })
        .then(({ status }) => {
          if (status != 204) {
            rej();
            return
          }
          res();
          store.dispatch(`fetchCategories`, true)
        }).catch(e => rej())
      })
    },
    async deleteCategory(store, name) {
      return new Promise<void>((res, rej) => {
        if (!store.getters[`auth/isLoggedIn`]) {
          rej();
          return;
        }
        axios.delete(`${API_URL}/category/${name}`, {
          headers: {
            Authorization: store.getters[`auth/getToken`]
          }
        })
        .then(({ status }) => {
          if (status != 204) {
            rej();
            return
          }
          res();
          store.dispatch(`fetchCategories`, true)
        }).catch(e => rej())
      })
    },
    async fetchSchema(store) {
      if (store.state.fetchedSchema) return
      const { data } = await axios.get(`${API_URL}/config`)
      store.commit(`setSchema`, data)
    },
    async addCategory(store, data) {
      if (!store.getters[`auth/isLoggedIn`]) {
        throw new Error(`Log in please!`)
      }
      const { status } = await axios.put(`${API_URL}/category/new`, data, {
        headers: {
          Authorization: store.getters[`auth/getToken`]
        }
      })
      
      if (status != 204) {
        throw new Error(`Error`)
      }

      store.dispatch(`fetchCategories`, true)
    }
  },
  modules: {
    auth: auth as any
  },
  getters: {
    categories: state => state.categories
  }
})
