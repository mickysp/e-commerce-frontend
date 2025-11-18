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
  min-height: 100vh;
}
</style> 