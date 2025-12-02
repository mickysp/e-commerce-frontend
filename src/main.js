import "./styles/global.css";

import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import VueSweetalert2 from "vue-sweetalert2";
import Swal from "sweetalert2";
import { initLocalStorageWatcher } from "@/services/auth/localStorageWatcher";

import "./assets/tailwind.css";

// ✅ เพิ่ม: import socket client
import socket from "@/plugins/socket";

Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);

if (window.location.hostname !== "localhost") {
  initLocalStorageWatcher();
}

// ใช้ ENV เดียวกับ socket.js
Vue.prototype.$domain_api = process.env.VUE_APP_API_URL;
Vue.prototype.$axios = axios;
Vue.prototype.$swal = Swal;

Vue.prototype.$socket = socket;

Vue.config.productionTip = false;

socket.on("connect", () => {
  console.log("socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("socket disconnected:", socket.id);
});

socket.on("forceLogout", (payload) => {
  console.log("forceLogout from server:", payload);

  store.dispatch("forceLogout", { authGroup: "user" });

  router.replace({
    name: "login",
    query: {
      reason: payload?.reason || "account_suspended",
    },
  });
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");