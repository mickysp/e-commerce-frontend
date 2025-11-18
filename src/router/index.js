import Vue from "vue";
import VueRouter from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import DefaultNavbarLogin from "@/layouts/DefaultLogin.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

import PageNotFound from "@/views/PageNotFound.vue";
import Home from "@/views/Home.vue";
import Board from "@/views/Board.vue";
import Delivery from "@/views/Delivery.vue";
import AboutUS from "@/views/AboutUS.vue";
import RegisterSeller from "@/views/RegisterSeller.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ProfileUser from "@/views/ProfileUser.vue";

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
    component: DefaultNavbarLogin, // ★ ได้ Navbar จากเลย์เอาต์นี้
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
