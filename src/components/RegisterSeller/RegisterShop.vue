<template>
  <div class="welcome-seller">
    <v-card class="welcome-card" elevation="0">
      <div class="icon-wrap">
        <v-icon size="96" color="#cf2e18">mdi-pencil-circle-outline</v-icon>
      </div>
      <h2 class="welcome-title">ยินดีต้อนรับผู้ใช้ใหม่</h2>
      <p class="subtitle">
        คุณสามารถเริ่มต้นการขายสินค้าใน EL-SON ได้โดยสร้างบัญชีผู้ขาย
      </p>
      <v-btn class="btn-primary" height="44" @click="$emit('start')">
        สร้างบัญชีผู้ขาย
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "RegisterShop",
  methods: {
    goCreateSeller() {
      this.$router.push({ name: "sellerRegister" });
    },
  },
};
</script>

<style scoped>
.welcome-seller {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 170px 300px;
  border-radius: 10px;
  margin: 90px 0;
}
.welcome-card {
  width: 600px;
  max-width: 95%;
  text-align: center;
}
.icon-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
}
.welcome-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
}
.subtitle {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 28px;
  font-family: "Noto Sans Thai", system-ui, sans-serif;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  font-weight: 600;
  border-radius: 6px !important;
  text-transform: none;
  font-size: 16px;
  padding: 0px 26px !important;
  letter-spacing: 0px;
}
</style>
