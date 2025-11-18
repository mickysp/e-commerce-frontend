<template>
  <section class="delivery-download">
    <v-container class="download-container">
      <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="12" md="8" class="text-col">
          <h2 class="download-text">
            จากครัวชุมชน สู่จานอาหารที่คุณหลงรักช้อปง่าย จ่ายสะดวก โหลดเลย!
          </h2>
        </v-col>

        <v-col cols="12" md="4" class="btn-col d-flex justify-end">
          <v-btn class="download-btn" height="44" rounded @click="showMaintenance">
            ดาวน์โหลดตอนนี้
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import swalAlert from "@/services/alert/swalServices.js";

export default {
  name: "DeliveryDownload",
  methods: {
    showMaintenance() {
      swalAlert.Warning("กำลังปรับปรุงระบบ", "โปรดกลับมาใหม่ในภายหลัง");
    },
  },
};
</script>

<style scoped>
.delivery-download {
  background: #b13929;
  padding: 60px 0;
  color: #ffffff;
  font-family: "Noto Sans Thai", system-ui, sans-serif;
  margin-top: 90px;
}
.download-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 64px;
  box-sizing: border-box;
}
.download-text {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.5;
  margin: 0;
}
.download-btn {
  background: #ffffff !important;
  color: #111827 !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  text-transform: none !important;
  padding: 0 32px !important;
  border-radius: 8px !important;
  transition: all 0.25s ease;
  letter-spacing: 0;
}
.download-btn:hover {
  background: #f3f4f6 !important;
}

@media (max-width: 960px) {
  .download-container {
    padding: 0 24px;
  }
  .download-text {
    text-align: center;
    font-size: 20px;
    margin-bottom: 16px;
  }
  .btn-col {
    justify-content: center !important;
  }
}
</style>
