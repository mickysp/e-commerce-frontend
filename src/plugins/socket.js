import io from "socket.io-client";
import store from "@/store";
import router from "@/router";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000";

const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("forceLogout", (payload = {}) => {
  const role = (store.getters.role || "").toLowerCase();

  const reason = payload.reason || "account_suspended";

  if (role === "admin" || role === "superadmin") {
    store.dispatch("forceLogout", { authGroup: "admin" });

    router.push({
      path: "/admin/login/login_admin",
      query: { reason },
    });
    return;
  }

  store.dispatch("forceLogout", { authGroup: "user" });

  router.push({
    path: "/information/login",
    query: { reason },
  });
});

export function connectUserSocket(userId) {
  if (!userId) return;

  socket.io.opts.query = { userId };

  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectUserSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}

export default socket;