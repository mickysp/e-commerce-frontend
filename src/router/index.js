import Vue from "vue";
import VueRouter from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import DefaultNavbarLogin from "@/layouts/DefaultLogin.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";
import DefaultAdmin from "@/layouts/DefaultAdmin.vue";
import DefaultAdminLogin from "@/layouts/DefaultAdminLogin.vue";
import PageNotFound from "@/views/PageNotFound.vue";

import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Board from "@/views/Board.vue";
import Delivery from "@/views/Delivery.vue";
import AboutUS from "@/views/AboutUS.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ProfileUser from "@/views/ProfileUser.vue";

import RegisterSeller from "@/views/RegisterSeller.vue";

import LoginAdmin from "@/components/Login/LoginAdmin.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import AdminUserManagement from "@/views/AdminUserManagement.vue";
import AdminOrderManagement from "@/views/AdminOrderManagement.vue";
import AdminSellerManagement from "@/views/AdminSellerManagement.vue";
import AdminBoard from "@/views/AdminBoard.vue";
import AdminCategory from "@/views/AdminCategory.vue";
import AdminProduct from "@/views/AdminProduct.vue";
import AdminManagement from "@/views/AdminManagement.vue";
import AdminProfile from "@/views/AdminProfile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/page_not_found",
    component: BlankLayout,
    children: [{ path: "", name: "PageNotFound", component: PageNotFound }],
  },
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "home", component: Home },
      { path: "aboutus", name: "aboutus", component: AboutUS },
      { path: "delivery", name: "delivery", component: Delivery },
      { path: "board", name: "board", component: Board },
      {
        path: "profile_user",
        name: "profile_user",
        component: ProfileUser,
        meta: { requiresAuth: true, authGroup: "user" },
      },
    ],
  },
  {
    path: "/information",
    component: DefaultNavbarLogin,
    children: [
      { path: "login", name: "login", component: Login, alias: "/login" },
      {
        path: "login/seller",
        name: "login_seller",
        component: Login,
        alias: "/login/seller",
      },
      {
        path: "register",
        name: "register",
        component: Register,
        alias: "/register",
      },
      {
        path: "forgotPassword",
        name: "forgotPassword",
        component: ForgotPassword,
        alias: "/forgotPassword",
      },
      {
        path: "register/seller",
        name: "register_seller",
        component: RegisterSeller,
        alias: "/register/seller",
      },
    ],
  },
  {
    path: "/admin/login",
    component: DefaultAdminLogin,
    children: [
      {
        path: "login_admin",
        name: "login_admin",
        component: LoginAdmin,
      },
    ],
  },
  {
    path: "/admin",
    component: DefaultAdmin,
    redirect: "/admin/dashboard",
    meta: {
      requiresAuth: true,
      authGroup: "admin",
      roles: ["admin", "superadmin"],
    },
    children: [
      {
        path: "dashboard",
        name: "admin_dashboard",
        component: AdminDashboard,
      },
      {
        path: "users",
        name: "admin_users",
        component: AdminUserManagement,
      },
      {
        path: "orders",
        name: "admin_orders",
        component: AdminOrderManagement,
      },
      {
        path: "sellers",
        name: "admin_sellers",
        component: AdminSellerManagement,
      },
      {
        path: "boards",
        name: "admin_boards",
        component: AdminBoard,
      },
      {
        path: "categories",
        name: "admin_category",
        component: AdminCategory,
      },
      {
        path: "products",
        name: "admin_product",
        component: AdminProduct,
      },
      {
        path: "admins",
        name: "admin_admins",
        component: AdminManagement,
      },
      {
        path: "profile",
        name: "admin_profile",
        component: AdminProfile,
      },
    ],
  },
  { path: "*", redirect: "/page_not_found" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 }),
});

router.beforeEach((to, from, next) => {
  const store = router.app && router.app.$store;

  const authGroup =
    to.matched.find((r) => r.meta && r.meta.authGroup)?.meta.authGroup ||
    "user";

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

  const LOGIN_ROUTE = {
    user: "login",
    seller: "login_seller",
    admin: "login_admin",
  };

  const tokenKey = TOKEN_KEYS[authGroup] || "user_token";
  const roleKey = ROLE_KEYS[authGroup] || "user_role";
  const loginRouteName = LOGIN_ROUTE[authGroup] || "login";

  let token = localStorage.getItem(tokenKey);
  let role = localStorage.getItem(roleKey);
  let tokenSourceKey = token ? tokenKey : null;
  let roleSourceKey = role ? roleKey : null;

  if (!token && (authGroup === "user" || authGroup === "seller")) {
    const legacyToken = localStorage.getItem("token");
    if (legacyToken) {
      token = legacyToken;
      tokenSourceKey = "token";
    }

    if (!role) {
      const legacyRole = localStorage.getItem("role");
      if (legacyRole) {
        role = legacyRole;
        roleSourceKey = "role";
      }
    }
  }

  if (!role) {
    role = "user";
  }

  let isTokenExpired = false;

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));

      if (payload.exp) {
        const nowInSeconds = Date.now() / 1000;
        if (payload.exp < nowInSeconds) {
          isTokenExpired = true;
        }
      }
    } catch (e) {
      isTokenExpired = true;
    }
  }

  if (token && isTokenExpired) {
    if (store && store.dispatch) {
      try {
        store.dispatch("forceLogout", { authGroup });
      } catch (e) {
        store.dispatch("forceLogout").catch(() => {});
      }
    }

    try {
      if (tokenSourceKey) localStorage.removeItem(tokenSourceKey);
      if (roleSourceKey) localStorage.removeItem(roleSourceKey);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(roleKey);
    } catch (e) {
      console.error("Error removing token:", e);
    }

    if (to.name !== loginRouteName) {
      return next({
        name: loginRouteName,
        query: {
          reason: "session_expired",
        },
      });
    }

    return next();
  }

  if (store && token && !isTokenExpired) {
    try {
      store.commit("SET_AUTH", {
        access_token: token,
        login_by: authGroup + "_token",
      });
    } catch (e) {
      // ignore
    }
  } else if (store && !token) {
    try {
      store.commit("CLEAR_SESSION");
    } catch (e) {
      // ignore
    }
  }

  const isLoggedIn = !!token;
  const requiresAuth = to.matched.some((r) => r.meta && r.meta.requiresAuth);
  const allowedRoles = to.matched
    .filter((r) => r.meta && r.meta.roles)
    .flatMap((r) => r.meta.roles);

  if (requiresAuth && !isLoggedIn) {
    return next({
      name: loginRouteName,
      query: { redirect: to.fullPath },
    });
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return next({ name: "PageNotFound" });
  }

  return next();
});

export default router;
