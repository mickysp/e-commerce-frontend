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
        meta: { requiresAuth: true },
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
    meta: { requiresAuth: true, roles: ["admin", "superadmin"] },
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
  const token = localStorage.getItem("token");

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
    store && store.dispatch("forceLogout");

    try {
      localStorage.clear();
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }

    if (to.name !== "login") {
      return next({
        name: "login",
        query: {
          reason: "session_expired",
        },
      });
    }

    return next();
  }

  const isLoggedIn =
    store?.getters?.isAuthenticated || !!localStorage.getItem("token");
  const role = store?.getters?.role || localStorage.getItem("role") || "user";

  const requiresAuth = to.matched.some((r) => r.meta && r.meta.requiresAuth);
  const allowedRoles = to.matched
    .filter((r) => r.meta && r.meta.roles)
    .flatMap((r) => r.meta.roles);

  if (requiresAuth && !isLoggedIn) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return next({ name: "PageNotFound" });
  }

  return next();
});

export default router;
