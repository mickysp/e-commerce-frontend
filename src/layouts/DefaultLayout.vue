<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "DefaultLayout",
  components: { Navbar, Footer },
};
</script>

<style scoped>
.v-main {
  min-height: auto !important;
  height: auto !important;
}
@media (max-width: 1024px) {
  :deep(main.v-main) {
    padding-top: 0px !important;
  }
}
</style>
