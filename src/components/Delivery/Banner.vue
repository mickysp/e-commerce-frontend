<template>
  <section class="banner-section">
    <v-row no-gutters align="center" class="banner-row">
      <v-col cols="12" md="6" class="text-col">
        <div class="text-content">
          <h1 class="banner-title">สั่งอาหาร–ช้อปของใช้ ครบจบในแอปเดียว</h1>

          <p class="banner-subtitle">
            สั่งอาหารอร่อยและช้อปของใช้จำเป็นได้ง่ายๆ ในที่เดียว สะดวก
            ประหยัดเวลา ส่งตรงถึงหน้าบ้านคุณทุกวัน
            พร้อมโปรโมชั่นสุดคุ้มจากร้านค้าชั้นนำ
            และบริการส่งที่รวดเร็วทั่วประเทศ
          </p>

          <v-btn
            color="#cf2e18"
            class="banner-btn"
            large
            rounded
            @click="showMaintenance"
          >
            สั่งเลย
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="6" class="image-col">
        <v-img
          :src="require('@/assets/delivery/banner.png')"
          alt="Delivery Banner"
          class="banner-img"
          cover
        />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import swalAlert from "@/services/alert/swalServices.js";

export default {
  name: "Banner",
  methods: {
    showMaintenance() {
      swalAlert.Warning("กำลังปรับปรุงระบบ", "โปรดกลับมาใหม่ในภายหลัง");
    },
  },
};
</script>

<style scoped>
.banner-section {
  width: 100%;
  overflow: hidden;
  background: #f5e9e9;
}
.text-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-content {
  padding: 0 64px;
  max-width: 810px;
  box-sizing: border-box;
}
.banner-title {
  font-size: 40px;
  font-weight: 700;
  color: #111827;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
  line-height: 1.3;
  margin-bottom: 14px;
}
.banner-subtitle {
  font-size: 17px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 28px;
}
.banner-btn {
  color: #fff !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  padding: 10px 36px !important;
  letter-spacing: 0;
}

.image-col {
  padding: 0 !important;
}

.banner-img {
  width: 100%;
  height: 750px;
  object-fit: cover;
  object-position: center;
}

@media (max-width: 960px) {
  .banner-row {
    flex-direction: column-reverse;
  }

  .text-col {
    padding: 36px 24px;
    text-align: center;
  }

  .text-content {
    padding: 0 24px;
  }
  .banner-img {
    height: 240px;
  }
  .banner-title {
    font-size: 26px;
  }
  .banner-subtitle {
    font-size: 15px;
  }
}
</style>
