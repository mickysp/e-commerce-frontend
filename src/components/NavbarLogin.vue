<template>
  <v-app-bar app flat color="#FFFFFF" :height="$vuetify.breakpoint.xs ? 56 : 70" class="kg-navbar elevation-0">
    <v-container class="navbar-inner px-4">
      <v-row no-gutters align="center" justify="start" class="align-center-row">
        <v-col
          cols="auto"
          class="d-flex align-center brand-click"
          @click="goHome"
        >
          <v-img
            :src="require('@/assets/logo.png')"
            alt="ELSON"
            class="brand-logo mr-3"
            contain
          />
          <span class="brand-text">ELSONlll</span>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavbarLogin",
  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
.kg-navbar.v-app-bar {
  border-bottom: 1px solid #e4e3e3 !important;
}
.navbar-inner {
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}
.align-center-row {
  display: flex;
  align-items: center;
}
.brand-logo {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: contain;
}
.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #cf2e18;
}
.brand-click {
  cursor: pointer;
  transition: opacity 0.2s;
}
.brand-click:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .kg-navbar {
    height: 56px !important;
  }
  .brand-logo {
    width: 40px;
    height: 40px;
  }
}
</style>
