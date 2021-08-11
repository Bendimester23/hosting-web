import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#0097e6',
                secondary: '#00a8ff',
                success: '#4cd137',
                info: '#fbc531',
                warning: '#c23616',
                error: '#e84118'
            }
        }
    }
});
