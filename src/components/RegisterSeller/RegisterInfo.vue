<template>
  <div class="register-info">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <v-form ref="form" v-model="valid">
          <div class="form-header">
            <div class="step-circle">1</div>
            <h2 class="form-title">ข้อมูลร้านค้า</h2>
          </div>

          <p class="muted mb-4">
            ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัย
            และใช้เพื่อยืนยันตัวตนตามวัตถุประสงค์และปฏิบัติตามกฎหมายเท่านั้น
          </p>

          <v-divider class="mb-4"></v-divider>
          
          <v-row>
            <!-- ชื่อร้านค้า -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span>ชื่อร้านค้า</span
              >
              <v-text-field
                v-model.trim="form.shopName"
                placeholder="ระบุชื่อร้านค้า"
                v-bind="tfProps"
                :rules="[req]"
              />
            </v-col>

            <!-- จังหวัด -->
            <v-col cols="12" sm="6">
              <span class="detail-text"><span class="req">*</span>จังหวัด</span>
              <v-text-field
                v-model.trim="form.province"
                placeholder="ระบุจังหวัด"
                v-bind="tfProps"
                :rules="[req]"
              />
            </v-col>

            <!-- เขต/อำเภอ: กรอกเอง -->
            <v-col cols="12" sm="6">
              <span class="detail-text"
                ><span class="req">*</span>เขต/อำเภอ</span
              >
              <v-text-field
                v-model.trim="form.district"
                placeholder="ระบุเขต/อำเภอ"
                v-bind="tfProps"
                :rules="[req]"
              />
            </v-col>

            <!-- แขวง/ตำบล: กรอกเอง -->
            <v-col cols="12" sm="6">
              <span class="detail-text"
                ><span class="req">*</span>แขวง/ตำบล</span
              >
              <v-text-field
                v-model.trim="form.subdistrict"
                placeholder="ระบุแขวง/ตำบล"
                v-bind="tfProps"
                :rules="[req]"
              />
            </v-col>

            <!-- รหัสไปรษณีย์: กรอกเอง -->
            <v-col cols="12" sm="6">
              <span class="detail-text"
                ><span class="req">*</span>รหัสไปรษณีย์</span
              >
              <v-text-field
                v-model.trim="form.postalCode"
                placeholder="เช่น 10110"
                v-bind="tfProps"
                :rules="[req, zip5]"
                maxlength="5"
                type="tel"
                inputmode="numeric"
                @keypress="onKeypressDigits"
                @input="filterDigits('postalCode', 5)"
              />
            </v-col>

            <!-- เลขบัญชี / ธนาคาร -->
            <v-col cols="12" sm="6">
              <span class="detail-text"
                ><span class="req">*</span>เลขบัญชี</span
              >
              <v-text-field
                v-model.trim="form.accountNumber"
                placeholder="ระบุเลขบัญชี"
                v-bind="tfProps"
                :rules="[req]"
                maxlength="20"
                type="tel"
                inputmode="numeric"
                @keypress="onKeypressDigits"
                @input="filterDigits('accountNumber', 20)"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <span class="detail-text"><span class="req">*</span>ธนาคาร</span>
              <v-select
                v-model="form.bankName"
                :items="banks"
                placeholder="เลือกธนาคาร"
                v-bind="selProps"
                :rules="[req]"
              >
                <template v-slot:append>
                  <img
                    :src="chev"
                    alt="chevron"
                    width="16"
                    height="16"
                    class="icon-rotate mt-1"
                  />
                </template>
              </v-select>
            </v-col>

            <!-- ที่อยู่รายละเอียดเพิ่มเติม: ไม่บังคับ + textarea สูงพอดี -->
            <v-col cols="12">
              <span class="detail-text">ที่อยู่รายละเอียดเพิ่มเติม</span>
              <v-textarea
                v-model.trim="form.addressDetail"
                placeholder="เช่น บ้านเลขที่/หมู่บ้าน/อาคาร/ซอย/ถนน"
                v-bind="taProps"
                rows="3"
                auto-grow
              />
            </v-col>

            <!-- เบอร์โทรศัพท์ -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span>เบอร์โทรศัพท์</span
              >
              <div class="phone-wrap">
                <v-text-field
                  class="cnumber"
                  v-model.trim="form.phone"
                  placeholder="ระบุเบอร์โทรศัพท์"
                  v-bind="tfProps"
                  :rules="[req, phone10]"
                  maxlength="10"
                  type="tel"
                  inputmode="numeric"
                  @keypress="onKeypressDigits"
                  @input="filterDigits('phone', 10)"
                />
              </div>
            </v-col>

            <!-- อีเมล -->
            <v-col cols="12">
              <span class="detail-text"><span class="req">*</span>อีเมล</span>
              <v-text-field
                v-model.trim="form.email"
                placeholder="ระบุอีเมล"
                v-bind="tfProps"
                :rules="[req, asciiOnly, emailRule]"
                @keypress="onKeypressAscii"
              />
            </v-col>

            <!-- รหัสผ่าน / ยืนยันรหัสผ่าน -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span>รหัสผ่าน</span
              >
              <v-text-field
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="ระบุรหัสผ่าน"
                v-bind="tfProps"
                :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPass = !showPass"
                :rules="[req, min8]"
              />
            </v-col>

            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span>ยืนยันรหัสผ่าน</span
              >
              <v-text-field
                v-model="form.password2"
                :type="showPass2 ? 'text' : 'password'"
                placeholder="ระบุรหัสผ่าน"
                v-bind="tfProps"
                :append-icon="showPass2 ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPass2 = !showPass2"
                :rules="[req, samePass]"
              />
            </v-col>

            <!-- ปุ่มถัดไป -->
            <v-col cols="12" class="mt-3">
              <v-btn block height="40" class="btn-primary" @click="handleNext">
                ถัดไป
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
  name: "RegisterInfo",
  props: {
    value: {
      type: Object,
      default: () => ({
        shopName: "",
        province: "",
        district: "",
        subdistrict: "",
        postalCode: "",
        addressDetail: "",
        accountNumber: "",
        bankName: "",
        phone: "",
        email: "",
        password: "",
        password2: "",
      }),
    },
  },
  data() {
    return {
      valid: false,
      showPass: false,
      showPass2: false,
      form: { ...this.value },

      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      taProps: {
        outlined: true,
        hideDetails: "auto",
        dense: true,
        autoGrow: true,
      },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        menuProps: { offsetY: true },
        dense: true,
        "append-icon": "",
      },

      banks: [
        "กสิกรไทย (KBank)",
        "ไทยพาณิชย์ (SCB)",
        "กรุงเทพ (BBL)",
        "กรุงไทย (KTB)",
        "ทหารไทยธนชาต (TTB)",
        "กรุงศรีอยุธยา (BAY)",
        "ซีไอเอ็มบีไทย (CIMB)",
        "ยูโอบี (UOB)",
        "ออมสิน",
      ],
      req: (v) => !!v || "กรุณากรอกข้อมูล",
      zip5: (v) =>
        (!!v && /^\d{5}$/.test(v)) || "กรอกให้ครบ 5 ตัว",
      phone10: (v) => (!!v && /^\d{10}$/.test(v)) || "ใส่ตัวเลข 10 หลัก",
      asciiOnly: (v) =>
        !v || /^[\x21-\x7E]+$/.test(v) || "อนุญาตเฉพาะตัวอักษรภาษาอังกฤษ",
      emailRule: (v) =>
        !v ||
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v) ||
        "อีเมลต้องอยู่ในรูปแบบ user@example.com",
      min8: (v) => (!!v && v.length >= 8) || "อย่างน้อย 8 ตัวอักษร",
      samePass: (v) => v === this.form.password || "รหัสผ่านไม่ตรงกัน",

      chev: require("@/assets/select/expand_icon.png"),
    };
  },

  methods: {
    handleNext() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.$emit("next", { ...this.form });
    },
    onKeypressDigits(e) {
      const k = e.key;
      if (!/[0-9]/.test(k)) e.preventDefault();
    },
    onKeypressAscii(e) {
      const code = e.key?.charCodeAt(0) ?? 0;
      if (code > 127) e.preventDefault();
    },
    filterDigits(field, max) {
      const val = (this.form[field] || "").replace(/\D+/g, "").slice(0, max);
      this.$set(this.form, field, val);
    },
  },

  watch: {
    value: {
      deep: true,
      handler(v) {
        this.form = { ...this.form, ...v };
      },
    },
  },
};
</script>

<style scoped>
.register-info {
  padding-bottom: 90px;
}
.form-container {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
}
.req {
  color: #e11d48;
  margin-right: 4px;
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
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #1f2a39;
  line-height: 1.4;
  margin-bottom: 2px;
}
:deep(.v-input) {
  margin-bottom: 8px !important;
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
:deep(.v-select.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
}
:deep(.v-select__selections) {
  min-height: 45px !important;
  height: 45px !important;
  align-items: center !important;
  font-size: 14px !important;
}
:deep(.v-menu__content .v-list-item) {
  min-height: 28px !important;
  height: 28px !important;
}
:deep(.v-menu__content .v-list-item__title) {
  font-size: 14px !important;
  line-height: 1.3 !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
.v-text-field--outlined.v-input.v-input--is-disabled >>> fieldset {
  border-color: #f3f5f7 !important;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
.btn-secondary {
  background: #e5e7eb !important;
  color: #111827 !important;
  border-radius: 8px !important;
  min-width: 96px;
}
.v-select .icon-rotate {
  transition: transform 0.3s ease;
  transform: rotate(0);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
.phone-wrap {
  display: flex;
  gap: 0;
}
.phone-wrap .cnumber :deep(.v-input__slot) {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}

:deep(.v-textarea.v-input--dense .v-input__slot) {
  padding: 8px 10px !important;
  min-height: 100px !important;
}
:deep(.v-textarea textarea) {
  font-size: 14px !important;
  line-height: 1.6 !important;
}
</style>
