<template>
  <v-app class="login-layout">
    <NavbarLogin />
    <v-main class="center-stage">
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import NavbarLogin from "@/components/NavbarLogin.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "DefaultLogin",
  components: { NavbarLogin, Footer },
};
</script>

<style scoped>
.login-layout :deep(.v-application--wrap) {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.login-layout :deep(.v-main) {
  padding: 0 !important;
}
.center-stage {
  flex: 1;
  display: grid;
  place-items: center;
  padding: clamp(24px, 6vh, 64px) 16px clamp(32px, 8vh, 96px);
  background-color: rgb(245, 245, 245);
  /* background:
    radial-gradient(circle at 60% 40%, rgba(255,180,180,0.4), transparent 70%),
    repeating-linear-gradient(45deg, rgba(255,210,210,0.12) 0 2px, transparent 2px 8px),
    linear-gradient(135deg, #fff6f5, #ffecec); */
  background-blend-mode: soft-light;
  background-attachment: fixed;
  animation: glow 14s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 55% 45%;
  }
}
</style>
