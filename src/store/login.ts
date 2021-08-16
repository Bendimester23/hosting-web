import axios from 'axios';
import { Commit } from 'vuex'

export const API_URL = `http://46.31.178.145:3000`;/*'http://localhost:3000/auth';*/

export async function logoutA(commit: Commit) {
    commit('setToken', '');
    commit('setLoggedIn', false);
    commit('setUser', {
        username: ``,
        email: ``,
        isAdmin: false
    });
}

export async function loginA(commit: Commit, username: string, password: string) {
    const { status, data } = await axios.post(`${API_URL}/auth/login`, {
        username: username,
        password: password
    });
    if (status != 200) {
        //error
        logoutA(commit)
        return;
    }
    commit('setToken', data.token);
    commit('setLoggedIn', true);
    commit('setUser', data.user);
    localStorage.setItem(`token`, data.token)
}

export async function refreshA(commit: Commit, token: string) {
    const { data, status } = await axios.get(`${API_URL}/auth/refresh?isAdmin=false`, {
        headers: {
            Authorization: token
        }
    });
    if (status != 200) {
        logoutA(commit);
        return;
    }

    commit('setToken', data.token);
    commit('setLoggedIn', true);
    commit('setUser', data.user);
}
