<template>
  <div class="register-iden-card">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <v-form ref="form" v-model="valid">
          <div class="form-header">
            <div class="step-circle">2</div>
            <h2 class="form-title">ยืนยันตัวตน</h2>
          </div>

          <p class="muted mb-4">
            ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัย
            และใช้เพื่อวัตถุประสงค์ในการยืนยันตัวตนและปฏิบัติตามข้อกฎหมายเท่านั้น
          </p>

          <v-divider class="mb-4"></v-divider>

          <v-row>
            <!-- เลขบัตรประชาชน -->
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span>เลขบัตรประชาชน</span
              >
              <v-text-field
                v-model.trim="form.citizenId"
                placeholder="ระบุเลขบัตรประชาชน 13 หลัก"
                v-bind="tfProps"
                :rules="[req, onlyDigit, id13]"
                maxlength="13"
                type="tel"
                inputmode="numeric"
                @keypress="onKeypressDigits"
                @input="filterDigits('citizenId', 13)"
              />
            </v-col>

            <!-- คำนำหน้า / ชื่อ / นามสกุล -->
            <v-col cols="12" sm="3">
              <span class="detail-text"
                ><span class="req">*</span>คำนำหน้า</span
              >
              <v-select
                v-model="form.prefix"
                :items="prefixItems"
                placeholder="เลือก"
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
            <v-col cols="12" sm="5">
              <span class="detail-text"><span class="req">*</span>ชื่อ</span>
              <v-text-field
                v-model.trim="form.firstName"
                placeholder="ระบุชื่อ"
                v-bind="tfProps"
                :rules="[req]"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <span class="detail-text"><span class="req">*</span>นามสกุล</span>
              <v-text-field
                v-model.trim="form.lastName"
                placeholder="ระบุนามสกุล"
                v-bind="tfProps"
                :rules="[req]"
              />
            </v-col>

            <!-- วัน/เดือน/ปีเกิด -->
            <v-col cols="12" sm="4">
              <span class="detail-text"><span class="req">*</span>วัน</span>
              <v-select
                v-model="form.birth.day"
                :items="days"
                placeholder="วัน"
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
            <v-col cols="12" sm="4">
              <span class="detail-text"><span class="req">*</span>เดือน</span>
              <v-select
                v-model="form.birth.month"
                :items="months"
                placeholder="เดือน"
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
            <v-col cols="12" sm="4">
              <span class="detail-text"><span class="req">*</span>ปีเกิด</span>
              <v-select
                v-model="form.birth.year"
                :items="years"
                placeholder="ปี"
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

            <!-- วันอนุญาตออกบัตร -->
            <v-col cols="12" sm="6">
              <span class="detail-text"
                ><span class="req">*</span>วันอนุญาตออกบัตร</span
              >
              <v-menu
                v-model="menuIssue"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="issueText"
                    v-bind="tfProps"
                    placeholder="เลือกวันที่"
                    readonly
                    v-on="on"
                    :rules="[req]"
                  />
                </template>
                <v-date-picker
                  v-model="form.issueDate"
                  @input="menuIssue = false"
                  locale="th"
                  :max="today"
                />
              </v-menu>
            </v-col>

            <!-- วันหมดอายุบัตร -->
            <v-col cols="12" sm="6">
              <span class="detail-text"
                ><span class="req">*</span>วันหมดอายุบัตร</span
              >
              <v-menu
                v-model="menuExpire"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="expireText"
                    v-bind="tfProps"
                    placeholder="เลือกวันที่"
                    readonly
                    v-on="on"
                    :rules="[req, afterIssue]"
                  />
                </template>
                <v-date-picker
                  v-model="form.expireDate"
                  @input="menuExpire = false"
                  locale="th"
                  :min="form.issueDate || undefined"
                />
              </v-menu>
            </v-col>

            <!-- ปุ่ม -->
            <v-col cols="12" class="mt-3 d-flex justify-space-between">
              <v-btn class="btn-secondary" height="40" @click="$emit('back')">
                ย้อนกลับ
              </v-btn>
              <v-btn class="btn-primary" height="40" @click="handleNext">
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
  name: "RegisterIdenCard",
  props: {
    value: {
      type: Object,
      default: () => ({
        citizenId: "",
        prefix: "",
        firstName: "",
        lastName: "",
        birth: { day: null, month: null, year: null },
        issueDate: null,
        expireDate: null,
      }),
    },
  },

  data() {
    const yearNow = new Date().getFullYear();
    return {
      valid: false,
      form: {
        ...this.value,
        birth: {
          day: null,
          month: null,
          year: null,
          ...(this.value.birth || {}),
        },
      },
      menuIssue: false,
      menuExpire: false,
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        menuProps: { offsetY: true },
        dense: true,
        "append-icon": "",
      },
      prefixItems: ["นาย", "นาง", "นางสาว", "อื่น ๆ"],
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
      years: Array.from({ length: 100 }, (_, i) => yearNow - i),
      req: (v) => !!v || "กรุณากรอกข้อมูล",
      onlyDigit: (v) => !v || /^\d+$/.test(v) || "กรอกเฉพาะตัวเลข",
      id13: (v) => !v || v.length === 13 || "ต้องมี 13 หลัก",
      afterIssue: (v) =>
        !v ||
        !this.form.issueDate ||
        new Date(v) >= new Date(this.form.issueDate) ||
        "ต้องไม่ก่อนวันอนุญาตออกบัตร",

      chev: require("@/assets/select/expand_icon.png"),
      today: new Date().toISOString().substr(0, 10),
    };
  },

  computed: {
    issueText() {
      return this.form.issueDate ? this.formatDate(this.form.issueDate) : "";
    },
    expireText() {
      return this.form.expireDate ? this.formatDate(this.form.expireDate) : "";
    },
  },

  methods: {
    handleNext() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.$emit("next", { ...this.form });
    },
    formatDate(iso) {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    },
    onKeypressDigits(e) {
      const k = e.key;
      if (!/[0-9]/.test(k)) e.preventDefault();
    },
    filterDigits(field, max) {
      const val = (this.form[field] || "").replace(/\D+/g, "").slice(0, max);
      this.$set(this.form, field, val);
    },
  },

  watch: {
    form: {
      deep: true,
      handler(v) {
        this.$emit("input", { ...v });
      },
    },
  },
};
</script>

<style scoped>
.register-iden-card {
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

/* ปุ่ม */
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
.btn-secondary {
  background: #e5e7eb !important;
  color: #111827 !important;
  border-radius: 8px !important;
}
.gap-3 {
  gap: 12px;
}
.flex-1 {
  flex: 1;
}
</style>
