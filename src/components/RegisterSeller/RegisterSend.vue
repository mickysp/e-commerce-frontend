<template>
  <div class="register-send">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <v-form ref="form" v-model="valid">
          <div class="form-header">
            <div class="step-circle">3</div>
            <h2 class="form-title">ส่งแบบฟอร์ม</h2>
          </div>

          <p class="muted mb-4">
            ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัย
            และใช้เพื่อวัตถุประสงค์ในการยืนยันตัวตนและปฏิบัติตามข้อกฎหมายเท่านั้น
          </p>

          <v-divider class="mb-4" />

          <ul class="policy-list">
            <li>ข้อมูลที่คุณกรอกจะถูกจัดเก็บในระบบอย่างปลอดภัย</li>
            <li>
              ระบบจะนำข้อมูลของคุณไปตรวจสอบเพื่อยืนยันความถูกต้อง
              เพื่อให้มั่นใจว่าเป็นผู้มีสิทธิ์เป็นจริง
            </li>
            <li>
              ข้อมูลของคุณจะนำไปใช้ในการติดต่อกับคุณเท่านั้น
              แสดงรายละเอียดเฉพาะที่จำเป็นต่อการตรวจสอบตามกฎหมาย
            </li>
          </ul>

          <p class="muted small-note">
            ข้อมูลของคุณจะถูกเก็บอย่างปลอดภัย เพื่อใช้ในการยืนยันตัวตน
            ตรวจสอบข้อมูล และดำเนินธุรกรรมต่าง ๆ
            โดยการส่งแบบฟอร์มนี้ถือเป็นการยืนยันความต้องการเปิดร้านค้ากับเรา
          </p>

          <div class="checkbox-wrap">
            <v-checkbox
              v-model="notRobot"
              :ripple="false"
              :label="'ฉันยอมรับข้อตกลง'"
            />
          </div>

          <div class="actions mt-6">
            <v-btn
              block
              class="btn-confirm"
              height="44"
              :disabled="!notRobot"
              @click="submit"
            >
              ยืนยัน
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>

export default {
  name: "RegisterSend",
  data() {
    return {
      valid: false,
      notRobot: false,
    };
  },
  methods: {
    async submit() {
      this.$refs.form.validate();
      if (!this.valid || !this.notRobot) return;
      this.$emit("submit");
    },
  },
};
</script>

<style scoped>
.register-send {
  padding-bottom: 90px;
}
.form-container {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
}
.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
}
.form-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.section-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.06);
}
.section-card :deep(p.muted) {
  text-align: left !important;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 16px;
}
.policy-list {
  margin: 8px 0 16px;
  padding-left: 24px;
  color: #1f2a39;
  line-height: 1.6;
  font-size: 16px;
  list-style-type: disc;
}
.policy-list li {
  margin-bottom: 4px;
}
.small-note {
  font-size: 14px;
  color: #6b7280 !important;
  margin-top: 8px;
}
.checkbox-wrap {
  border-radius: 8px;
}
.actions {
  margin-top: 24px;
}
.btn-secondary {
  background: #f3f4f6 !important;
  color: #111827 !important;
  border-radius: 8px !important;
  min-width: 120px;
}
.btn-confirm {
  background: #cf2e18 !important;
  color: #ffffff !important;
  border-radius: 8px !important;
  min-width: 120px;
}
</style>
