<template>
  <v-footer class="elson-footer" padless>
    <v-container class="footer-wrap py-10">
      <v-row align="start">
        <v-col cols="12" md="4">
          <span class="brand">ELSON</span>
          <p class="desc mt-2">
            กิจการร่วมค้า กรงกฏ ก๊อด แอนด์ คอมพ์ สันติ์ ยูนิวิร์ส
            คอร์ปอเรชั่น<br />
            ที่อยู่: 1, เอ็มไพร์ ทาวเวอร์, ชั้น 47, ห้อง 4703, สาทรใต้, ยานนาวา,
            สาทร, กรุงเทพมหานคร 10120<br />
            เบอร์โทร: <a href="tel:0975947888" class="link">097-594-7888</a
            ><br />
            อีเมล:
            <a href="mailto:korakot.cr.train@gmail.com" class="link"
              >korakot.cr.train@gmail.com</a
            >
          </p>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <h3 class="title">เมนู</h3>
          <ul class="links">
            <li><a href="#" class="link">หน้าแรก</a></li>
            <li><a href="#" class="link">กระดานข่าว</a></li>
            <li><a href="#" class="link">ตลาดชุมชน</a></li>
            <li><a href="#" class="link">เปิดร้านค้า</a></li>
            <li><a href="#" class="link">เกี่ยวกับเรา</a></li>
          </ul>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <h3 class="title">บริการของเรา</h3>
          <ul class="links">
            <li><a href="#" class="link">สินค้าเดลิเวอรี่</a></li>
            <li><a href="#" class="link">โปรโมชั่นพิเศษ</a></li>
            <li><a href="#" class="link">ศูนย์ช่วยเหลือ</a></li>
            <li><a href="#" class="link">คำถามที่พบบ่อย</a></li>
            <li><a href="#" class="link">ติดต่อเรา</a></li>
          </ul>
        </v-col>

        <v-col cols="12" md="3">
          <h3 class="title">ติดตามเรา</h3>
          <div class="socials mt-3">
            <a href="#" class="social"><v-icon>mdi-facebook</v-icon></a>
            <a href="#" class="social"><v-icon>mdi-instagram</v-icon></a>
            <a href="#" class="social"><v-icon>mdi-youtube</v-icon></a>
          </div>
        </v-col>
      </v-row>

      <v-divider class="foot-divider my-8" />

      <v-row align="center" justify="space-between" class="legal">
        <span>© {{ new Date().getFullYear() }} ELSON — สงวนลิขสิทธิ์</span>
        <div class="legal-links">
          <router-link to="/" class="link"
            >นโยบายความเป็นส่วนตัว</router-link
          >
          <span class="dot">•</span>
          <router-link to="/" class="link">ข้อกำหนดการใช้งาน</router-link>
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default { name: "Footer" };
</script>

<style scoped>
.elson-footer {
  background: #272727 !important;
  color: #f2f2f2;
}
.footer-wrap {
  max-width: min(1440px, 90vw);
  margin: 0 auto;
  font-family: "Noto Sans Thai", sans-serif;
  padding-inline: clamp(24px, 4vw, 64px);
}
.footer-wrap :deep(.v-row) {
  row-gap: 32px;
}
.brand {
  font-size: clamp(20px, 1.4vw, 22px);
  font-weight: 700;
  color: #cf2e18;
}
.desc {
  color: #cccccc;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
}
.title {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  font-family: "Noto Sans Thai", Arial, sans-serif !important;
}
.links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.links li {
  margin-bottom: 8px;
}
.link {
  color: #dddddd;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.link:hover {
  color: #ffffff;
}
.socials {
  display: flex;
  gap: 10px;
}
.social {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f2f2f2;
  transition: all 0.2s ease;
}
.social:hover {
  background: #5e5b5a;
  color: white;
}
.foot-divider {
  border-color: rgba(255, 255, 255, 0.15) !important;
}
.legal {
  width: 100%;
  font-size: 13px;
  color: #a5a5a5;
  flex-wrap: wrap;
  row-gap: 8px;
}
.legal-links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  opacity: 0.6;
}

@media (max-width: 1440px) {
  .footer-wrap {
    max-width: 1200px;
    padding-inline: clamp(16px, 4vw, 40px);
  }
}
@media (max-width: 960px) {
  .legal {
    flex-direction: column;
    text-align: center;
  }
}
</style>