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
};
</script>

<style scoped>
.welcome-seller {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  padding: 16px;
}
.welcome-card {
  width: 100%;
  max-width: 90%;
  min-height: 70vh;
  display: flex;               
  flex-direction: column;      
  justify-content: center;     
  text-align: center;
  background: #fff;
  border-radius: 10px;
  padding: 60px 60px;
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
}
.subtitle {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 28px;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  font-weight: 600;
  border-radius: 6px !important;
  text-transform: none;
  font-size: 16px;
  padding: 0px 26px !important;
  width: auto !important;    
  align-self: center;        
}
@media (max-width: 600px) {
  .welcome-card {
    width: 100%;
    min-height: auto;
    padding: 40px 20px;
  }
}
</style>
