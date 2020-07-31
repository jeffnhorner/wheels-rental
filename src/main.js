// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import Vuetify from "vuetify";
import VueMq from "vue-mq";
import Vuex from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faFacebookSquare,
    faTwitter,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

const vuetifyOptions = {
    theme: {
        themes: {
            light: {
                primary: '#00CDAC',
            },
        },
    },
};

// Add fontawesome icons
library.add(faFacebookSquare, faTwitter, faInstagram);

export default function (Vue, { router, head, isClient, appOptions }) {
    Vue.use(Vuetify);
    Vue.use(VueMq, {
        breakpoints: {
            xs: 414,
            sm: 567,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: Infinity,
        }
    });
    // Instantiate the component
    Vue.component("FontAwesome", FontAwesomeIcon);

    Vue.use(Vuex);

    // Instantiate a new vuex store
    appOptions.store = new Vuex.Store({
        state: {
            rentalCheckoutStep: 1,
            userData: {},
            userResetRentalCheckoutFlow: false,
        },

        mutations: {
            updateRentalCheckoutStep (state, step) {
                state.rentalCheckoutStep = step;
            },

            setUserData (state, userData) {
                state.userData = { ...state.userData, ...userData };
            },

            userResetRentalCheckoutFlow(state, hasBeenReset) {
                state.userResetRentalCheckoutFlow = hasBeenReset;
            }
        },
    });

    // Set default layout as a global component
    Vue.component('Layout', DefaultLayout)
    appOptions.vuetify = new Vuetify(vuetifyOptions);
}
