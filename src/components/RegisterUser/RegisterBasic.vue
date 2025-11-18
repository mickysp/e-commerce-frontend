<template>
  <div class="register-basic">
    <div class="form-container">
        <v-card class="section-card" elevation="0">
          <v-form ref="form1" v-model="valid1">
            <div class="form-header">
              <div class="step-circle">1</div>
              <h2 class="form-title">ข้อมูลพื้นฐาน</h2>
            </div>

            <p class="muted mb-4">
              กรุณากรอกข้อมูลพื้นฐานของคุณให้ครบถ้วนและถูกต้อง
              ข้อมูลเหล่านี้จะใช้ยืนยันตัวตนของผู้ใช้งาน
            </p>

            <v-row>
              <v-col cols="12">
                <span class="detail-text"><span class="req">*</span>คำนำหน้า</span>
                <v-select
                  v-model="form.prefix"
                  :items="prefixItems"
                  placeholder="เลือกคำนำหน้า"
                  v-bind="selProps"
                  :rules="[req]"
                >
                  <template v-slot:append>
                    <img
                      :src="require('@/assets/select/expand_icon.png')"
                      alt="chevron"
                      width="16"
                      height="16"
                      class="icon-rotate mt-1"
                    />
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12">
                <span class="detail-text"><span class="req">*</span>ชื่อ</span>
                <v-text-field
                  v-model.trim="form.firstName"
                  placeholder="ระบุชื่อ"
                  v-bind="tfProps"
                  :rules="[req]"
                />
              </v-col>

              <v-col cols="12">
                <span class="detail-text">ชื่อกลาง (ถ้ามี)</span>
                <v-text-field
                  v-model.trim="form.middleName"
                  placeholder="ระบุชื่อกลาง"
                  v-bind="tfProps"
                />
              </v-col>

              <v-col cols="12">
                <span class="detail-text"><span class="req">*</span>นามสกุล</span>
                <v-text-field
                  v-model.trim="form.lastName"
                  placeholder="ระบุนามสกุล"
                  v-bind="tfProps"
                  :rules="[req]"
                />
              </v-col>

              <v-col cols="12">
                <span class="detail-text"><span class="req">*</span>เพศ</span>
                <v-radio-group
                  v-model="form.gender"
                  row
                  class="nationality-radio-group rg-compact"
                  :rules="[req]"
                  hide-details="auto"
                >
                  <v-radio label="ชาย" value="ชาย" />
                  <v-radio label="หญิง" value="หญิง" />
                  <v-radio label="อื่นๆ" value="อื่นๆ" />
                </v-radio-group>
              </v-col>

              <v-col cols="12">
                <span class="detail-text"><span class="req">*</span>วันเดือนปีเกิดตามบัตรประชาชน</span>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="form.birth.day"
                      :items="days"
                      placeholder="วัน"
                      v-bind="selProps"
                      :rules="[req]"
                    >
                      <template v-slot:append>
                        <img
                          :src="require('@/assets/select/expand_icon.png')"
                          alt="chevron"
                          width="16"
                          height="16"
                          class="icon-rotate mt-1"
                        />
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="form.birth.month"
                      :items="months"
                      placeholder="เดือน"
                      v-bind="selProps"
                      :rules="[req]"
                    >
                      <template v-slot:append>
                        <img
                          :src="require('@/assets/select/expand_icon.png')"
                          alt="chevron"
                          width="16"
                          height="16"
                          class="icon-rotate mt-1"
                        />
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="form.birth.year"
                      :items="years"
                      placeholder="ปี"
                      v-bind="selProps"
                      :rules="[req]"
                    >
                      <template v-slot:append>
                        <img
                          :src="require('@/assets/select/expand_icon.png')"
                          alt="chevron"
                          width="16"
                          height="16"
                          class="icon-rotate mt-1"
                        />
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-3">
                <v-btn block height="40" class="btn-primary" @click="nextFrom1">
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
  name: "RegisterBasic",
  props: {
    value: {
      type: Object,
      default: () => ({
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        birth: { day: null, month: null, year: null },
      }),
    },
  },

  data() {
    const yearNow = new Date().getFullYear();
    return {
      valid1: false,
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        menuProps: { offsetY: true },
        dense: true,
        "append-icon": "",
      },
      days: Array.from({ length: 31 }, (_, i) => i + 1),
      months: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
      years: Array.from({ length: 80 }, (_, i) => yearNow - i),
      prefixItems: ["นาย", "นาง", "นางสาว"],
      form: { ...this.value },
      req: (v) => !!v || "กรุณากรอกข้อมูล",
    };
  },
  methods: {
    nextFrom1() {
      this.$refs.form1.validate();
      if (!this.valid1) return;
      this.$emit("next", { ...this.form });
    },
  },
};
</script>

<style scoped>
.register-basic {
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
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
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
  line-height: 1.4 !important;
}
:deep(.v-menu__content .v-list-item) {
  min-height: 28px !important;
  height: 28px !important;
}
:deep(.v-menu__content .v-list-item__title) {
  font-size: 14px !important;
  line-height: 1.3 !important;
}
:deep(.v-select__selections),
:deep(.v-text-field__slot),
:deep(.v-label),
:deep(.v-input),
:deep(.v-autocomplete),
:deep(.v-text-field__suffix) {
  font-size: 14px !important;
  line-height: 1.4 !important;
}
:deep(.v-messages__message) {
  font-size: 12px !important;
  line-height: 1.4 !important;
  margin-left: -10px !important;
}
:deep(.v-input--selection-controls .v-input__slot) {
  min-height: 28px !important;
  height: 28px !important;
}
:deep(.v-input--selection-controls .v-label) {
  font-size: 14px !important;
  line-height: 20px !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
.v-text-field--outlined.v-input.v-input--is-disabled >>> fieldset {
  border-color: #f3f5f7 !important;
}
.v-select .icon-rotate {
  transition: transform 0.3s ease;
  transform: rotate(0deg);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
:deep(.v-input) {
  margin-bottom: 8px !important;
}
</style>
