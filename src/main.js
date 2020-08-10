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
import * as VueGoogleMaps from 'vue2-google-maps';
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

const mixpanel = require('mixpanel-browser');

// Instantiate the mixpanel instance
mixpanel.init(process.env.GRIDSOME_MIXPANEL_TOKEN);

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
    Vue.use(VueGoogleMaps, {
        load: {
            key: process.env.GRIDSOME_GOOGLE_MAP_API_KEY,
            libraries: 'places,geometry'
        },
        installComponents: true,
    });
    Vue.use(Vuex);

    //Proxy mixpanel to Vue prototype object so we can use it throughout
    // the application.
    Vue.prototype.$mixpanel = mixpanel;

    // We need this defined globally since we can't reference $mixpanel.get_distinct_id()
    // within components.
    Vue.prototype.$mixpanel_unique_id = mixpanel.get_distinct_id();

    // Instantiate the component
    Vue.component("FontAwesome", FontAwesomeIcon);

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
                // Spread the current state's userData with any new userData
                state.userData = { ...state.userData, ...userData };
            },

            userResetRentalCheckoutFlow(state, userInitiatedRestart) {
                if (state.verificationCode) {
                    // TODO: If the user resets the checkout flow, they must
                    // request a new verification code?
                    state.verificationCode = null;
                }

                state.userResetRentalCheckoutFlow = userInitiatedRestart;
            }
        },
    });

    // Set default layout as a global component
    Vue.component('Layout', DefaultLayout)
    appOptions.vuetify = new Vuetify(vuetifyOptions);
}
