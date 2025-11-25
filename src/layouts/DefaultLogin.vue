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
.center-stage {
  background-color: rgb(245, 245, 245);
}
</style>
