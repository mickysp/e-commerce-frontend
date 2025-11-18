<template>
  <section class="reward-card">
    <v-container class="reward-container">
      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="12" md="6" class="img-col">
          <v-img
            :src="require('@/assets/delivery/card_food.png')"
            alt="สะสมแต้ม–รับสิทธิพิเศษ"
            class="reward-img"
            contain
          />
        </v-col>

        <v-col cols="12" md="6" class="text-col">
          <div class="text-wrap">
            <h2 class="reward-title">
              สะสมแต้ม – รับสิทธิพิเศษโปรเด็ดสำหรับคุณ
            </h2>
            <p class="reward-desc">
              ทุกการสั่งซื้อผ่านแอปจะได้รับแต้มสะสมอัตโนมัติ
              สะสมครบแลกรับส่วนลด ของแถมหรือดีลพิเศษจากร้านค้าที่ร่วมรายการ
              เพิ่มความคุ้มค่าให้ทุกการใช้งาน พร้อมโปรโมชั่นอัปเดตใหม่ตลอดทั้งเดือน
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "RewardCard",
};
</script>

<style scoped>
.reward-card {
  background: #ffffff;
  padding: 80px 0;
  font-family: "Noto Sans Thai", system-ui, sans-serif;
}
.reward-container {
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 80px;
}
.text-col {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.text-wrap {
  max-width: 520px;
}
.reward-title {
  font-weight: 800;
  font-size: 32px;
  line-height: 1.3;
  color: #111827;
  margin-bottom: 16px;
}
.reward-desc {
  font-size: 18px;
  line-height: 1.7;
  color: #374151;
  margin: 0;
}
.img-col {
  display: flex;
  justify-content: center;
}
.reward-img {
  width: 70%;
  max-width: 420px;
  height: auto;
  border-radius: 16px;
}

@media (max-width: 960px) {
  .reward-card {
    padding: 60px 20px;
  }
  .reward-container {
    padding: 0;
  }
  .text-col {
    justify-content: center;
    text-align: center;
    margin-top: 28px;
  }
  .reward-title {
    font-size: 26px;
  }
  .reward-desc {
    font-size: 15px;
  }
  .reward-img {
    max-width: 300px;
  }
}
</style>
