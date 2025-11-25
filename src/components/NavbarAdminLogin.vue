<template>
  <v-app-bar
    flat
    height="48"
    class="navbar-admin-login"
    color="transparent"
  >
    <v-container class="navbar-container">
      <div class="d-flex align-center brand-click">
        <div class="brand-text-group">
          <span class="logo-text">ELSONllll</span>
        </div>
      </div>

      <div></div>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavbarAdminLogin",
};
</script>

<style scoped>
.navbar-admin-login {
  background: #ffffff !important;
  border-bottom: 1px solid #e5e7eb;
  height: 60px !important;
}
:deep(.v-toolbar__content) {
  min-height: 60px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.navbar-container {
  max-width: 1440px;
  margin: 0 auto;
}
.brand-click {
  cursor: default;
}
.brand-text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.logo-text {
  font-size: 22px;
  font-weight: 600;
  color: #2563eb;
  letter-spacing: 0em;      
  text-rendering: optimizeLegibility;
}
@media (min-width: 1440px) and (max-width: 1919px) {
  .navbar-container {
    max-width: 1200px;
  }
}
</style>
