<template>
  <section class="delivery-detail">
    <v-container class="detail-container">
      <v-row align="start" justify="space-between" no-gutters>
        <v-col cols="12" md="5" class="left-col">
          <h2 class="form-title">
            แพลตฟอร์มเดียว<br />
            เชื่อมต่อผู้ใช้งาน ร้านค้า<br />
            และคนขับ ครบวงจร
          </h2>
        </v-col>

        <v-col cols="12" md="6" class="right-col">
          <p class="desc">
            แอปพลิเคชันที่ออกแบบมาเพื่อให้การสั่งซื้ออาหารและของใช้ในชีวิตประจำวันเป็นเรื่องง่าย
            พร้อมระบบจัดการร้านค้าและการจัดส่งที่รวดเร็ว
            เชื่อมต่อทุกฝ่ายเข้าด้วยกันอย่างลงตัว
          </p>
        </v-col>
      </v-row>
    </v-container>

    <div class="connect-section">
      <v-container>
        <h2 class="connect-title">เชื่อมต่อครบทุกฝ่าย</h2>

        <v-row justify="center" align="start" class="mt-8">
          <v-col cols="12" md="4" class="connect-item">
            <div class="icon-wrap">
              <v-img
                src="@/assets/delivery/user_icon.png"
                alt="ผู้ใช้งาน"
                width="60"
                height="60"
                contain
              />
            </div>
            <h3 class="item-title">ผู้ใช้งาน</h3>
            <p class="item-desc">
              เลือกซื้ออาหารหรือของใช้ได้สะดวกผ่านแอป
              พร้อมระบบติดตามสถานะคำสั่งซื้อแบบเรียลไทม์
            </p>
          </v-col>

          <v-col cols="12" md="4" class="connect-item">
            <div class="icon-wrap">
              <v-img
                src="@/assets/delivery/shop_icon.png"
                alt="ร้านค้า"
                width="60"
                height="60"
                contain
              />
            </div>
            <h3 class="item-title">ร้านค้า</h3>
            <p class="item-desc">
              จัดการออเดอร์ ขายสินค้าได้ง่าย
              เพิ่มยอดขายพร้อมเครื่องมือช่วยบริหารร้านอย่างมีประสิทธิภาพ
            </p>
          </v-col>

          <v-col cols="12" md="4" class="connect-item">
            <div class="icon-wrap">
              <v-img
                src="@/assets/delivery/driver_icon.png"
                alt="คนขับ"
                width="60"
                height="60"
                contain
              />
            </div>
            <h3 class="item-title">คนขับ</h3>
            <p class="item-desc">
              รับงานจัดส่งสินค้าอย่างรวดเร็ว รับรายได้ต่อเนื่อง
              พร้อมระบบแจ้งเตือนคำสั่งซื้ออัตโนมัติ
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="food-banner">
      <v-img
        :src="require('@/assets/delivery/food.png')"
        alt="Food Banner"
        class="food-img"
        cover
      />
    </div>
  </section>
</template>

<script>
export default {
  name: "DeliveryDetail",
};
</script>

<style scoped>
.delivery-detail {
  background: #ffffff;
  padding: 130px 0 40px;
  font-family: "Noto Sans Thai", system-ui, sans-serif;
}
.detail-container {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;    
  margin-right: auto;
  padding: 0 100px 110px;
  box-sizing: border-box;
}
.form-title {
  font-weight: 800;
  font-size: 36px;
  line-height: 1.3;
  color: #111827;
  margin: 0;
}
.desc {
  font-weight: 400;
  font-size: 20px;
  line-height: 1.9;
  color: #4b5563;
  margin: 4px 0 0;
  text-align: left;
  max-width: 540px;
}
.connect-section {
  text-align: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  padding-top: 20px;
}
.connect-title {
  font-weight: 800;
  font-size: 32px;
  color: #111827;
  margin-bottom: 48px;
  position: relative;
}
.connect-title::after {
  content: "";
  display: block;
  width: 90px;
  height: 3px;
  background: #111827;
  margin: 10px auto 0;
  border-radius: 4px;
}
.connect-item {
  text-align: center;
  padding: 20px;
}
.icon-wrap {
  width: 84px;
  height: 84px;
  margin: 0 auto 16px;
  background: #f9fafb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-title {
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 8px;
  color: #111827;
}
.item-desc {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.7;
  max-width: 300px;
  margin: 0 auto;
}
.food-banner {
  overflow: hidden;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  padding-top: 150px;
}
.food-img {
  width: 100%;
  height: 520px;
  object-fit: cover;
  object-position: center;
  display: block;
  border-radius: 0;
}
@media (max-width: 960px) {
  .delivery-detail {
    padding: 40px 0;
  }
  .form-title {
    font-size: 26px;
    text-align: center;
  }
  .desc {
    font-size: 15px;
    text-align: center;
    max-width: none;
  }
  .connect-title {
    font-size: 24px;
  }
}
</style>
