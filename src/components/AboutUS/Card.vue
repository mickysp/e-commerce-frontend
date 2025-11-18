<template>
  <div class="process-section">
    <v-container>
      <div class="text-center mb-10">
        <h3 class="process-en">OUR PROCESS</h3>
        <br />
        <h2 class="process-th">3 ขั้นตอน บริการของเรา</h2>
        <br />
        <p class="process-desc">
          3 ขั้นตอน นำเสนอการออกแบบและก่อสร้าง ครบจบ ในที่เดียว
        </p>
      </div>

      <v-row dense>
        <v-col cols="12" class="mb-6">
          <v-card class="process-card green-card" elevation="2">
            <h3 class="process-title">
              1. วิเคราะห์และวางแผน (Planning & Consultation)
            </h3>
            <p class="process-text">
              รับฟังความต้องการของลูกค้า สำรวจพื้นที่จริง
              และให้คำปรึกษาด้านแนวคิดการออกแบบ การใช้พื้นที่ และงบประมาณ
              เพื่อวางแผนโครงการอย่างเป็นระบบ
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" class="mb-6">
          <v-card class="process-card yellow-card" elevation="2">
            <h3 class="process-title">
              2. ออกแบบและจัดทำแบบ (Design & Documentation)
            </h3>
            <p class="process-text">
              ดำเนินการออกแบบตามสไตล์ของโครงการ ทั้งโครงสร้างและระบบประกอบอาคาร
              พร้อมจัดทำแบบก่อสร้างและเอกสารประกอบด้านงบประมาณ
              เพื่อเตรียมความพร้อมสำหรับขั้นตอนการก่อสร้าง
            </p>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card class="process-card blue-card" elevation="2">
            <h3 class="process-title">
              3. ควบคุมและบริหารงานก่อสร้าง (Construction Supervision)
            </h3>
            <p class="process-text">
              ควบคุมคุณภาพงานก่อสร้างทุกขั้นตอน
              ให้เป็นไปตามแบบและมาตรฐานวิศวกรรม พร้อมบริหารเวลา งบประมาณ
              และความปลอดภัยในหน้างานอย่างมีประสิทธิภาพ
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Card",
};
</script>

<style scoped>
.process-section {
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-bottom: 100px;
  padding-top: 100px;
}
.process-en {
  color: #cf2e18;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 6px;
  text-align: left;
}
.process-th {
  color: #cf2e18;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: left;
}
.process-desc {
  font-size: 20px;
  text-align: left;
}
.process-card {
  border-radius: 10px;
  padding: 24px 30px;
  color: #ffffff;
}
.green-card {
  background-color: #ce6d12;
}
.yellow-card {
  background-color: #158549;
}
.blue-card {
  background-color: #cf2e18;
}
.process-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}
.process-text {
  font-size: 15px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .process-section {
    padding: 50px 0;
  }
  .process-th {
    font-size: 22px;
  }
  .process-desc {
    font-size: 14px;
  }
  .process-card {
    padding: 18px;
  }
  .process-title {
    font-size: 16px;
  }
  .process-text {
    font-size: 14px;
  }
}
</style>
