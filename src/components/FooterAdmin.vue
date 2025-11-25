<template>
  <footer class="footer-admin">
    <v-container class="footer-container d-flex align-center justify-center">
      <span class="footer-text">
        © {{ new Date().getFullYear() }} ELSONllll — All rights reserved.
      </span>
    </v-container>
  </footer>
</template>

<script>
export default {
  name: "FooterAdmin",
};
</script>

<style scoped>
.footer-admin {
  background: #222222;
  border-top: 1px solid #e5e7eb;
  padding: 8px 0;
  height: 60px;
}
.footer-container {
  text-align: center;
}
.footer-text {
  font-size: 13px;
  color: #ffffff;
  font-family: "Noto Sans Thai", sans-serif;
  letter-spacing: 0.3px;
}
</style>
