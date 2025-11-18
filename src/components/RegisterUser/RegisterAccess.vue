<template>
  <div class="register-access">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <v-form ref="form" v-model="localValid">
          <!-- header -->
          <div class="form-header">
            <div class="step-circle">3</div>
            <h2 class="form-title">ข้อมูลเข้าใช้งาน</h2>
          </div>

          <p class="muted mb-4">
            ข้อมูลเหล่านี้จะใช้สำหรับการเข้าสู่ระบบและระบุตัวตนของคุณในระบบ
            โปรดตรวจสอบให้แน่ใจว่ารหัสผ่านมีความปลอดภัยและจำได้ง่าย
          </p>

          <v-row>
            <!-- ชื่อผู้ใช้ -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> ชื่อผู้ใช้</span
              >
              <v-text-field
                v-model.trim="form.username"
                v-bind="tfProps2"
                :rules="[req, userRule]"
                placeholder="ระบุชื่อผู้ใช้ (3–30 ตัว A–Z, 0–9, . _ -)"
              />
            </v-col>

            <!-- อีเมล -->
            <v-col cols="12">
              <span class="detail-text"><span class="req">*</span> อีเมล</span>
              <v-text-field
                v-model.trim="form.email"
                v-bind="tfProps2"
                :rules="[req, emailRule]"
                placeholder="your@email.com"
              />
            </v-col>

            <!-- รหัสผ่าน -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> รหัสผ่าน</span
              >
              <v-text-field
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPass = !showPass"
                v-bind="tfProps2"
                :rules="[req, passRule]"
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
            </v-col>

            <!-- ยืนยันรหัสผ่าน -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> ยืนยันรหัสผ่าน</span
              >
              <v-text-field
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                :append-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showConfirm = !showConfirm"
                v-bind="tfProps2"
                :rules="[req, confirmRule]"
                placeholder="พิมพ์รหัสผ่านเดิมอีกครั้ง"
              />
            </v-col>

            <!-- รหัสผู้แนะนำ -->
            <v-col cols="12">
              <span class="detail-text">รหัสผู้แนะนำ (ถ้ามี)</span>
              <v-text-field
                v-model.trim="form.refCode"
                v-bind="tfProps2"
                placeholder="กรอกรหัสผู้แนะนำ"
              />
            </v-col>

            <!-- ปุ่ม -->
            <v-col cols="12" class="mt-3">
              <v-btn
                block
                height="40"
                class="btn-primary"
                :disabled="!localValid"
                @click="handleSubmit"
              >
                ลงทะเบียน
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterAccess",
  props: {
    valid: { type: Boolean, default: false },
    value: {
      type: Object,
      default: () => ({
        username: "",
        email: "",
        password: "",
        confirm: "",
        refCode: "",
      }),
    },
  },

  data() {
    return {
      form: { ...this.value },
      showPass: false,
      showConfirm: false,
      req: (v) => !!v || "กรุณากรอกข้อมูล",
      emailRule: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "") || "อีเมลต้องอยู่ในรูปแบบ user@example.com",
      userRule: (v) =>
        /^[a-z0-9._-]{3,30}$/i.test(v || "") || "3–30 ตัว (A–Z,0–9,._-)",
      passRule: (v) =>
        (v && v.length >= 8) || "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      tfProps2: { outlined: true, hideDetails: "auto", dense: true },
    };
  },

  computed: {
    localValid: {
      get() {
        return this.valid;
      },
      set(v) {
        this.$emit("update:valid", v);
      },
    },
    confirmRule() {
      return (v) => v === this.form.password || "รหัสผ่านไม่ตรงกัน";
    },
  },

  watch: {
    value: {
      deep: true,
      handler(v) {
        this.form = { ...v };
      },
    },
  },
  
  methods: {
    handleSubmit() {
      this.$refs.form.validate();
      if (!this.localValid) return;
      this.$emit("submit", { ...this.form });
    },
  },
};
</script>

<style scoped>
.register-access {
  padding-bottom: 90px;
}
.form-container {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
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
  background: #333;
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
.req {
  color: #e11d48;
  margin-right: 4px;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #1f2a39;
  line-height: 1.4;
  margin-bottom: 2px;
}
:deep(.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
}
:deep(.v-text-field.v-input--dense input) {
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
.v-text-field--outlined.v-input.v-input--is-disabled >>> fieldset {
  border-color: #f3f5f7 !important;
}
:deep(.v-input) {
  margin-bottom: 8px !important;
}
:deep(.v-messages__message) {
  font-size: 12px !important;
  line-height: 1.4 !important;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
</style>
