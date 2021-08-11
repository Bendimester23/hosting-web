import axios from 'axios';
import { Commit } from 'vuex'

const API_URL = 'http://localhost:3000/auth';

export async function loginA(commit: Commit, username: string, password: string) {
    const resp = await axios.post(API_URL + '/login', {
        username: username,
        password: password
    });
    if (resp.status != 200) {
        //error
        commit('setToken', '');
        commit('setLoggedIn', false);
        commit('setUsername', '');
        console.error(resp);
        return;
    }
    commit('setToken', resp.data.token);
    commit('setLoggedIn', true);
    commit('setUsername', username);
}

export async function logoutA(commit: Commit) {
    commit('setToken', '');
    commit('setLoggedIn', false);
    commit('setUsername', '');
}