<template>
  <v-app>
    <SidebaeAdmin @logout="handleLogout" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SidebaeAdmin from "@/components/SidebarAdmin.vue";
import { logoutApi } from "@/services/api/auth";

export default {
  name: "DefaultAdmin",
  components: {
    SidebaeAdmin,
  },

  methods: {
    async handleLogout() {
      try {
        await logoutApi().catch(() => {});
      } catch (e) {
        console.error("Logout error:", e);
      } finally {
        if (this.$store && this.$store.dispatch) {
          await this.$store.dispatch("logout").catch(() => {});
        }

        localStorage.removeItem("vuex");
        localStorage.removeItem("token");

        sessionStorage.clear();

        this.$router.replace({ name: "login_admin" }).catch(() => {});
      }
    },
  },
};
</script>

<style scoped>
:deep(main.v-main) {
  min-height: 100vh;
  background: #f6f9ff;
}
</style>