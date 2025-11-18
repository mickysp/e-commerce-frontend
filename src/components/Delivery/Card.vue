<template>
  <section class="review-card">
    <v-container class="review-container">
      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="12" md="6" class="text-col">
          <div class="text-wrap">
            <h2 class="review-title">รีวิวและคะแนนความพึงพอใจ</h2>
            <p class="review-desc">
              ระบบให้คะแนนและเขียนรีวิวร้านค้า/คนขับ
              สร้างความเชื่อมั่นให้ผู้ใช้งานใหม่
              และช่วยให้ร้านค้าพัฒนาบริการได้ต่อเนื่อง
              เสริมความโปร่งใสในการให้บริการ
              พร้อมสะท้อนคุณภาพของร้านค้าและการจัดส่ง
              เพื่อยกระดับประสบการณ์ของผู้ใช้ให้ดียิ่งขึ้น
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="img-col">
          <v-img
            :src="require('@/assets/delivery/review.png')"
            alt="รีวิวและคะแนนความพึงพอใจ"
            class="review-img"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "ReviewCard",
};
</script>

<style scoped>
.review-card {
  background: #f5e9e9;
  padding: 80px 0;
  font-family: "Noto Sans Thai", system-ui, sans-serif;
  margin-top: 150px;
}
.review-container {
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
}
.text-col {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.text-wrap {
  max-width: 520px;
}
.review-title {
  font-weight: 800;
  font-size: 32px;
  line-height: 1.3;
  color: #111827;
  margin-bottom: 16px;
}
.review-desc {
  font-size: 18px;
  line-height: 1.7;
  color: #374151;
  margin: 0;
}
.img-col {
  display: flex;
  justify-content: center;
}
.review-img {
  width: 100%;
  max-width: 420px;
  height: auto;
  border-radius: 16px;
}
@media (max-width: 960px) {
  .review-card {
    padding: 60px 20px;
  }
  .review-container {
    padding: 0;
  }
  .text-col {
    justify-content: center;
    text-align: center;
    margin-bottom: 28px;
  }
  .review-title {
    font-size: 26px;
  }
  .review-desc {
    font-size: 15px;
  }
  .review-img {
    max-width: 300px;
  }
}
</style>
