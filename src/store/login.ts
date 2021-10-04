import axios from 'axios';
import {Store} from "vuex";

export const API_URL = 'http://localhost:3000';

export default {
    namespaced: true,
    strict: true,
    state: {
        authToken: ``,
        loggedIn: false,
        username: ``,
        email: ``,
        isAdmin: false
    },
    getters: {
        isLoggedIn: (state: any) => state.loggedIn,
        isAdmin: (state: any) => state.isAdmin,
        getUsername: (state: any) => state.username,
        getToken: (state: any) => state.authToken
    },
    mutations: {
        setToken(state: any, token: string) {
            state.authToken = token;
        },
        setLoggedIn(state: any, loggedIn: boolean) {
            state.loggedIn = loggedIn;
        },
        setUser(state: any, user: any) {
            state.username = user.username;
            state.email = user.email;
            state.isAdmin = user.isAdmin;
        },
    },
    actions: {
        logout(store: any) {
            store.commit('setToken', '');
            store.commit('setLoggedIn', false);
            store.commit('setUser', {
                username: ``,
                email: ``,
                isAdmin: false
            });
            localStorage.removeItem(`token`)
        },
        login(store: any, payload: any): Promise<void> {
            return new Promise((resolve, reject) => {
                axios.post(`${API_URL}/auth/login`, {
                    username: payload.username,
                    password: payload.password
                }).then(({status, data}) => {
                    if (status != 200) {
                        //error
                        store.dispatch(`logout`);
                        reject(`Login failed`);
                    }

                    store.commit('setToken', data.token);
                    store.commit('setLoggedIn', true);
                    store.commit('setUser', data.user);
                    localStorage.setItem(`token`, data.token)
                    resolve();
                }).catch(reason => {
                    store.dispatch(`logout`);
                    reject(new Error(`Login failed`));
                });
            })
        },
        async refresh(store: any, token: string) {
            const {data, status} = await axios.get(`${API_URL}/auth/refresh?isAdmin=false`, {
                headers: {
                    Authorization: token
                }
            });
            if (status != 200) {
                store.dispatch(`logout`);
                throw new Error("Failed to refresh session.")
            }

            store.commit('setToken', data.token);
            store.commit('setLoggedIn', true);
            store.commit('setUser', data.user);
        },
        async register(store: Store<any>, payload: RegisterPayload): Promise<boolean> {
            const {data, status} = await axios.post(`${API_URL}/auth/register`, payload)

            switch (status) {
                case 201:
                    return data == `VERIFY`;
                case 400:
                    store.commit(`triggerError`, `Hibás adatok!`)
                    break
                case 403:
                    store.commit(`triggerError`, `Hibásan kitöltött Captcha!`)
                    break
                case 409:
                    store.commit(`triggerError`, `A felhasználónév már használatban van!`)
                    break
                default:
                case 500:
                    store.commit(`triggerError`, `Belső szerverhiba történt!`)
            }
            throw new Error();
        }
    }
};

export type RegisterPayload = {
    email: string;
    name: string;
    password: string;
    captcha: string;
}
