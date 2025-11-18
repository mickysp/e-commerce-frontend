<template>
  <v-app>
    <Navbar />
    <v-main class="no-padding-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/NavbarDashboard.vue';

export default {
  name: "NavbarDashboardLayout",
  components: { Navbar },
};
</script>

<style scoped>
.v-main {
  background-color: #F5F7FA;
}
.no-padding-main {
  padding-top: 56px !important;
  padding-left: 56px !important;
  padding-right: 56px !important;
}
</style>