import Vue from 'vue'
import Vuex from 'vuex'
import { loginA, logoutA } from './login';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: {
      size: 0
    },
    login: {
      authToken: '',
      loggedIn: false,
      username: ''
    }
  },
  mutations: {
    setToken(state: any, token: string) {
      state.login.authToken = token;
    },
    setLoggedIn(state: any, loggedIn: boolean) {
      state.login.loggedIn = loggedIn;
    },
    setUsername(state: any, username: string) {
      state.login.username = username;
    }
  },
  actions: {
    login(store: any, data: any) {
      loginA(store.commit, data.username, data.password);
    },
    logOut(store: any) {
      logoutA(store.commit);
    }
  },
  modules: {
  }
})
