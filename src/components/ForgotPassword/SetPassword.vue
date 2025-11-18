<template>
  <div class="find-account-page">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <h2 class="form-title mb-2">ตั้งค่ารหัสผ่านใหม่</h2>
        <p class="subtitle mb-6">
          สร้างรหัสผ่านใหม่ที่มีความยาวอย่างน้อย 8 อักขระ
          แนะนำให้มีทั้งตัวอักษรและตัวเลขเพื่อความปลอดภัย
        </p>

        <v-form ref="form" v-model="formValid" @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> รหัสผ่านใหม่</span
              >
              <v-text-field
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPass = !showPass"
                v-bind="tfProps"
                :rules="[rules.required, rules.min8, rules.alnum]"
                placeholder="อย่างน้อย 8 ตัวอักษร และมีทั้งตัวอักษร/ตัวเลข"
              />
            </v-col>

            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> ยืนยันรหัสผ่าน</span
              >
              <v-text-field
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                :append-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showConfirm = !showConfirm"
                v-bind="tfProps"
                :rules="[rules.required, rules.match]"
                placeholder="พิมพ์รหัสผ่านเดิมอีกครั้ง"
              />
            </v-col>

            <v-col cols="12" class="mt-2 d-flex justify-end btn-row">
              <v-btn class="btn-secondary" height="40" @click="$emit('cancel')">
                ยกเลิก
              </v-btn>
              <v-btn
                class="btn-primary"
                height="40"
                :disabled="!canSubmit"
                type="submit"
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
  name: "SetPassword",
  data() {
    return {
      showPass: false,
      showConfirm: false,
      formValid: false,
      form: {
        password: "",
        confirm: "",
      },
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
    };
  },
  computed: {
    canSubmit() {
      const p = this.form.password || "";
      const c = this.form.confirm || "";
      const min8 = p.length >= 8;
      const alnum = /[A-Za-z]/.test(p) && /\d/.test(p);
      const match = p === c;
      return min8 && alnum && match;
    },
    rules() {
      return {
        required: (v) => (!!v && String(v).trim() !== "") || "กรุณากรอกข้อมูล",
        min8: (v) =>
          (v && v.length >= 8) || "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        alnum: (v) =>
          (/[A-Za-z]/.test(v || "") && /\d/.test(v || "")) ||
          "ควรมีทั้งตัวอักษรและตัวเลขอย่างน้อยอย่างละ 1",
        match: (v) =>
          v === this.form.password || "ยืนยันรหัสผ่านไม่ตรงกับรหัสผ่านใหม่",
      };
    },
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate();
      if (!this.canSubmit) return;
      this.$emit("reset", { password: this.form.password });
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
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
  padding-top: 10px;
}
.subtitle {
  font-size: 14px;
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
