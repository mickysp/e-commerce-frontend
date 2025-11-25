import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

function decodeJwt(token = "") {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

const TOKEN_KEYS = {
  user: "user_token",
  seller: "seller_token",
  admin: "admin_token",
};

const ROLE_KEYS = {
  user: "user_role",
  seller: "seller_role",
  admin: "admin_role",
};

function clearAuthFromStorage(authGroup = "user") {
  const tokenKey = TOKEN_KEYS[authGroup];
  const roleKey = ROLE_KEYS[authGroup];

  try {
    if (tokenKey) localStorage.removeItem(tokenKey);
    if (roleKey) localStorage.removeItem(roleKey);

    if (authGroup === "user" || authGroup === "seller") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  } catch (e) {
    // ignore
  }
}

const initialState = () => ({
  auth: {
    access_token: "",
    login_by: "",
  },
  user: {
    _id: "",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    role: "user",
    profileImage: "",
    defaultAddress: null,
    referral: {
      referralCode: "",
      inviteCode: "",
      referralCount: 0,
    },
  },
  seller: {
    sellerId: "",
    shopName: "",
    email: "",
    sellerType: "",
  },
});

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "vuex",
      paths: ["user", "seller"],
    }),
  ],

  state: initialState(),

  getters: {
    isAuthenticated: (state) => Boolean(state.auth.access_token),
    accessToken: (state) => state.auth.access_token || "",
    authHeader: (state, getters) =>
      getters.accessToken
        ? { Authorization: `Bearer ${getters.accessToken}` }
        : {},
    tokenPayload: (state, getters) => decodeJwt(getters.accessToken),

    displayName: (state) => {
      const { firstName, middleName, lastName, username, email } = state.user;
      const name = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
      if (name) return name;
      if (username) return username;
      return email || "ผู้ใช้";
    },
    fullName: (state) => {
      const { prefix, firstName, middleName, lastName } = state.user;
      return [prefix, firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
    },
    avatarUrl: (state) => state.user.profileImage || "",

    role: (state, getters) =>
      (getters.tokenPayload?.role || state.user.role || "user").toLowerCase(),

    isAdmin: (state, getters) => getters.role === "admin",
    isSeller: (state, getters) => getters.role === "seller",
    userId: (state) => state.user._id || "",
    defaultAddressId: (state) => state.user.defaultAddress || null,
    maskedEmail: (state) => {
      const email = state.user.email || "";
      const [name, domain] = email.split("@");
      if (!name || !domain) return email;
      const masked =
        name.length <= 2
          ? name[0] + "*"
          : name.slice(0, 2) + "*".repeat(Math.max(1, name.length - 2));
      return `${masked}@${domain}`;
    },
    referralInfo: (state) => state.user.referral,

    sellerInfo: (state) => state.seller,
  },

  mutations: {
    SET_AUTH(state, { access_token = "", login_by = "" } = {}) {
      state.auth.access_token = access_token;
      state.auth.login_by = login_by;
    },

    SET_TOKEN(state, token = "") {
      state.auth.access_token = token;
    },

    SET_USER(state, payload = {}) {
      const u = payload || {};
      state.user._id = u._id || u.id || "";
      state.user.prefix = u.prefix || "";
      state.user.firstName = u.firstName || "";
      state.user.middleName = u.middleName || "";
      state.user.lastName = u.lastName || "";
      state.user.username = u.username || "";
      state.user.email = u.email || "";
      state.user.role = u.role || "user";
      state.user.profileImage = u.profileImage || "";
      state.user.defaultAddress = u.defaultAddress || null;
      state.user.referral = {
        referralCode: u.referralCode || (u.referral?.referralCode || ""),
        inviteCode: u.inviteCode || (u.referral?.inviteCode || ""),
        referralCount:
          typeof u.referralCount === "number"
            ? u.referralCount
            : u.referral?.referralCount || 0,
      };
    },

    SET_SELLER(state, payload = {}) {
      state.seller.sellerId = payload.sellerId || payload.id || "";
      state.seller.shopName = payload.shopName || "";
      state.seller.email = payload.email || "";
      state.seller.sellerType = payload.sellerType || "";
    },

    UPDATE_USER_FIELD(state, { key, value }) {
      const keys = String(key).split(".");
      let cur = state.user;
      while (keys.length > 1) {
        const k = keys.shift();
        if (!(k in cur) || typeof cur[k] !== "object" || cur[k] === null) {
          Vue.set(cur, k, {});
        }
        cur = cur[k];
      }
      Vue.set(cur, keys[0], value);
    },

    CLEAR_SESSION(state) {
      state.auth.access_token = "";
      state.auth.login_by = "";
    },

    RESET_STATE(state) {
      const fresh = initialState();
      Object.keys(fresh).forEach((k) => {
        Vue.set(state, k, fresh[k]);
      });
    },
  },

  actions: {
    loginSuccess({ commit }, { token, loginBy = "password", user }) {
      commit("SET_AUTH", { access_token: token, login_by: loginBy });
      commit("SET_USER", user);
    },

    loginSellerSuccess({ commit }, { token, seller }) {
      commit("SET_AUTH", { access_token: token, login_by: "seller_password" });
      commit("SET_SELLER", {
        sellerId: seller.id,
        shopName: seller.shopName,
        email: seller.email,
        sellerType: seller.sellerType,
      });
    },

    logout({ commit }, payload = {}) {
      const authGroup = payload.authGroup || "user";
      commit("RESET_STATE");
      clearAuthFromStorage(authGroup);
    },

    forceLogout({ commit }, payload = {}) {
      const authGroup = payload.authGroup || "user";
      commit("RESET_STATE");
      clearAuthFromStorage(authGroup);
    },

    setDefaultAddress({ commit }, addressId) {
      commit("UPDATE_USER_FIELD", {
        key: "defaultAddress",
        value: addressId || null,
      });
    },
    updateReferralCode({ commit }, code) {
      commit("UPDATE_USER_FIELD", {
        key: "referral.referralCode",
        value: code || "",
      });
    },
  },

  modules: {},
});
