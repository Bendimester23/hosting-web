import axios from 'axios';
import Vue from 'vue'
import Vuex from 'vuex'
import { API_URL, loginA, logoutA, refreshA } from './login';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: {
      size: 0
    },
    login: {
      authToken: ``,
      loggedIn: false,
      username: ``,
      email: ``,
      isAdmin: false
    },
    categories: [],
    fetchedCategories: false
  },
  mutations: {
    setToken(state: any, token: string) {
      state.login.authToken = token;
    },
    setLoggedIn(state: any, loggedIn: boolean) {
      state.login.loggedIn = loggedIn;
    },
    setUser(state: any, user: any) {
      state.login.username = user.username;
      state.login.email = user.email;
      state.login.isAdmin = user.isAdmin;
    },
    setCategories(state: any, data: any) {
      state.categories = data.c;
      state.fetchCategories = data.f;
    }
  },
  actions: {
    login(store: any, data: any) {
      loginA(store.commit, data.username, data.password);
    },
    logOut(store: any) {
      logoutA(store.commit);
    },
    refresh(store: any, token: string) {
      refreshA(store.commit, token)
    },
    async fetchCategories(store: any, force: boolean) {
      return new Promise<void>((res, rej) => {
        if (!force && store.state.fetchCategories) {
          res()
          return
        }
        axios.get(`${API_URL}/category/all`).then(({ data, status }) => {
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
        if (!store.state.login.loggedIn) {
          rej();
          return;
        }
        axios.patch(`${API_URL}/category/${category.name}`, category.description, {
          headers: {
            Authorization: store.state.login.authToken
          }
        })
        .then(({ status }) => {
          if (status != 200) {
            rej();
            return
          }
          res();
          store.dispatch(`fetchCategories`, true)
        }).catch(e => rej())
      })
    }
  },
  modules: {
  },
  getters: {
    categories: state => state.categories
  }
})
