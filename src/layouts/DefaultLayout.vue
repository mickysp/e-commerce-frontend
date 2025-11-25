<template>
  <v-app>
    <Navbar />
<v-main class="main-with-nav">
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
.main-with-nav {
  padding-top: 112px;
}
</style>
