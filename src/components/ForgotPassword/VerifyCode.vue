<template>
  <div class="find-account-page">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <h2 class="form-title mb-2">ป้อนรหัสรักษาความปลอดภัย</h2>
        <p class="subtitle mb-6">
          โปรดตรวจสอบอีเมลของคุณว่ามีข้อความพร้อมรหัสหรือไม่ รหัสของคุณมีความยาว
          6 ตัวเลข เราส่งรหัสของคุณไปที่: <strong>{{ maskedEmail }}</strong>
        </p>

        <v-form ref="form" v-model="formValid" @submit.prevent="onSearch">
          <v-row>
            <v-col cols="12">
              <span class="detail-text">รหัส</span>
              <v-text-field
                v-model="code"
                v-bind="tfProps"
                placeholder="ระบุรหัส 6 หลัก"
                :rules="[rules.required, rules.sixDigits]"
                type="tel"
                inputmode="numeric"
                maxlength="6"
                counter="6"
                @input="onCodeInput"
                @keypress="digitsOnly"
                @paste.prevent="onPaste"
              />
            </v-col>

            <v-col cols="12" class="mt-2 d-flex justify-end btn-row">
              <v-btn class="btn-secondary" height="40" @click="$emit('cancel')">
                ยกเลิก
              </v-btn>
              <v-btn
                class="btn-primary"
                height="40"
                :disabled="!isCodeValid"
                type="submit"
                @click="onSearch"
              >
                ดำเนินการต่อ
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
  name: "VerifyCode",
  props: {
    email: { type: String, default: "" },
  },
  data() {
    return {
      code: "",
      formValid: false,
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      rules: {
        required: (v) =>
          (!!v && String(v).trim() !== "") || "กรุณากรอกรหัส 6 หลัก",
        sixDigits: (v) =>
          /^\d{6}$/.test(String(v || "")) || "ต้องเป็นตัวเลข 6 หลักเท่านั้น",
      },
    };
  },
  computed: {
    emailFromRoute() {
      return this.email || this.$route?.query?.email || "";
    },
    maskedEmail() {
      const e = this.emailFromRoute || "";
      if (!e.includes("@")) return e;
      const [u, d] = e.split("@");
      if (u.length <= 2) return `${u[0] || ""}*****@${d}`;
      return `${u[0]}*****${u[u.length - 1]}@${d}`;
    },
    isCodeValid() {
      return /^\d{6}$/.test(this.code);
    },
  },
  methods: {
    digitsOnly(e) {
      const k = e.which || e.keyCode;
      if (k < 48 || k > 57) e.preventDefault();
      if (String(this.code).length >= 6) e.preventDefault();
    },
    onCodeInput(e) {
      const digits = String(e?.target?.value ?? this.code)
        .replace(/\D/g, "")
        .slice(0, 6);
      this.code = digits;
    },
    onPaste(e) {
      const pasted = (e.clipboardData || window.clipboardData).getData("text");
      this.code = String(pasted).replace(/\D/g, "").slice(0, 6);
    },
    onSearch() {
      this.$refs.form.validate();
      if (!this.isCodeValid) return;

      this.$emit("verify", this.code);
    },
  },
};
</script>
<style scoped>
.form-container {
  width: 700px !important;
  max-width: 700px !important;
  margin: 0 auto;
}
.section-card {
  width: 100%;
  padding: 40px 30px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.06);
}
.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
  padding-top: 10px;
  padding-bottom: 5px;
}
.subtitle {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #1f2a39;
  line-height: 1.4;
  margin-bottom: 2px;
}
.req {
  color: #e11d48;
  margin-right: 4px;
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
:deep(.v-input) {
  margin-bottom: 8px !important;
}
:deep(.v-messages__message) {
  font-size: 12px !important;
  line-height: 1.4 !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
.v-text-field--outlined.v-input.v-input--is-disabled >>> fieldset {
  border-color: #f3f5f7 !important;
}
.btn-row {
  gap: 12px;
  justify-content: flex-end;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
.btn-secondary {
  background: #f3f4f6 !important;
  color: #111827 !important;
  border-radius: 8px !important;
}
</style>
