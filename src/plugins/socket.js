import io from "socket.io-client";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000";

const socket = io(API_URL, {
  autoConnect: false,         
  withCredentials: true,
  transports: ["websocket", "polling"],
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
