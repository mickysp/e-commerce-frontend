import "./styles/global.css";

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios";
import VueAxios from "vue-axios";
import VueSweetalert2 from "vue-sweetalert2";
import Swal from "sweetalert2";
import { initLocalStorageWatcher } from "@/services/auth/localStorageWatcher";

import './assets/tailwind.css'

Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);

if (window.location.hostname !== "localhost") {
  initLocalStorageWatcher();
}

Vue.prototype.$domain_api = process.env.VUE_APP_API_URL;
Vue.prototype.$axios = axios;
Vue.prototype.$swal = Swal;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");