<template>
  <div>
    <v-carousel
      hide-delimiter-background
      cycle
      height="600"
      show-arrows
      interval="4000"
    >
      <v-carousel-item v-for="(banner, index) in banners" :key="index">
        <v-img :src="banner.src" :alt="banner.alt" class="banner-image" />
      </v-carousel-item>
    </v-carousel>

    <div class="banner-text">
      <h2 class="banner-title">กิจการร่วมค้า กรกชฎ ก๊อต แอนด์ คอนซัลแตนท์</h2>
      <p class="banner-desc">
        ลงโฆษณา สินค้า และบริการ ตลาดขายออนไลน์, รับสร้างบ้าน, ออกแบบโครงการ<br />
        งานสื่อสาร, ประชาสัมพันธ์, ประชุมสัมมนา Tel. 0975947888
      </p>
    </div>

    <v-container class="about-section">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6" class="pr-md-8">
          <h1 class="about-h1">มาทำความรู้จักกับ</h1>
          <br>
          <h3 class="about-h3">กิจการร่วมค้า กรกรฏ ก๊อด แอนด์ คอนซัลแต้นท์</h3>
          <br />
          <p class="about-text">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;เราเป็นบริษัทนำเสนองานออกแบบและควบคุมงานก่อสร้างโดยมุ่งเน้นคุณภาพทั้งด้านความงาม
            และความมั่นคงของโครงสร้าง
            เราดูแลทุกขั้นตอนของโครงการอย่างใกล้ชิดตั้งแต่แนวคิดเบื้องต้นการออกแบบรายละเอียด
            การจัดทำแบบก่อสร้าง เราจึงยึดมั่นในความโปร่งใส การสื่อสารที่ชัดเจน
            และการทำงานร่วมกับลูกค้าอย่างมืออาชีพ
            เพื่อส่งมอบโครงการที่ตอบโจทย์จริง และยั่งยืนในระยะยาว
            <br /><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;นอกจากนี้ เรายังมุ่งพัฒนาอย่างต่อเนื่อง ทั้งในด้านบุคลากร
            ระบบการทำงาน และมาตรฐานการก่อสร้าง เพื่อยกระดับคุณภาพการให้บริการ
            และสร้างความเชื่อมั่นให้กับลูกค้าในระยะยาว เพราะเราเชื่อว่า
            "งานก่อสร้างที่ดี" ไม่ใช่เพียงการสร้างอาคารที่แข็งแรงเท่านั้น
            แต่ต้องสะท้อนถึงความตั้งใจ ความซื่อสัตย์
            และความรับผิดชอบในทุกขั้นตอนของการทำงาน
          </p>
        </v-col>

        <v-col cols="12" md="6" class="text-center">
          <v-img
            :src="require('@/assets/home/interesting.png')"
            alt="Interesting"
            class="about-image"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "AboutUSBannerDetail",
  data() {
    return {
      banners: [
        { src: require("@/assets/home/banner2.png"), alt: "Banner 2" },
        { src: require("@/assets/home/banner1.png"), alt: "Banner 1" },
        { src: require("@/assets/home/banner3.png"), alt: "Banner 3" },
        { src: require("@/assets/home/banner4.png"), alt: "Banner 4" },
      ],
    };
  },
};
</script>

<style scoped>
.banner-image {
  width: 100%;
  height: 600px;
  object-fit: cover;
  object-position: center;
  display: block;
}
.banner-text {
  text-align: center;
  padding-top: 100px;
  background-color: #ffffff;
}
.banner-title {
  font-weight: 500;
  font-size: 35px;
  color: #111827;
  margin-bottom: 8px;
}
.banner-desc {
  font-size: 18px;
  color: #333333;
  line-height: 1.6;
}
.about-section{
  max-width: 1440px; 
  margin: 0 auto;    
  padding: 0 40px;     
  box-sizing: border-box;
  padding-top: 100px;
}
@media (min-width: 1440px) and (max-width: 1919px) {
  .about-section {
    max-width: 1200px;
  }
}
.about-h1 {
  font-size: 40px;
  font-weight: 600;
}
.about-h3 {
  font-size: 28px;
}
.about-text {
  font-size: 16px;
}

@media (max-width: 768px) {
  .banner-image {
    height: 300px;
  }
  .banner-title {
    font-size: 18px;
  }
  .banner-desc {
    font-size: 13px;
  }
}
</style>
