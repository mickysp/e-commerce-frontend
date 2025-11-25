<template>
  <v-app>
    <NavbarAdminLogin />

    <v-main>
      <router-view />
    </v-main>

    <FooterAdmin />
  </v-app>
</template>

<script>
import NavbarAdminLogin from "@/components/NavbarAdminLogin.vue";
import FooterAdmin from "@/components/FooterAdmin.vue";

export default {
  name: "DefaultAdminLogin",
  components: { NavbarAdminLogin, FooterAdmin },
};
</script>