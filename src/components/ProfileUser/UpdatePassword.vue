<template>
  <div class="password-form">
    <v-card class="section-card" elevation="0">
      <!-- หัวการ์ด -->
      <div class="card-head">
        <div class="head-gradient head-gradient--green" />
        <div class="head-inner">
          <h2 class="form-title">เปลี่ยนรหัสผ่าน</h2>
          <p class="subtitle">
            กรอกข้อมูลให้ครบถ้วน เพื่อดำเนินการเปลี่ยนรหัสผ่าน
          </p>
        </div>
      </div>

      <v-divider class="mb-4" />

      <v-form ref="form" v-model="valid" class="section-form pt-0">
        <v-row>
          <!-- รหัสผ่านเดิม -->
          <v-col cols="12">
            <span class="detail-text">รหัสผ่านเดิม</span>
            <v-text-field
              :type="showOld ? 'text' : 'password'"
              v-model.trim="form.currentPassword"
              placeholder="กรอกรหัสผ่านเดิม"
              v-bind="tfProps"
              :append-icon="showOld ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showOld = !showOld"
              :rules="[rules.reqOld]"
              @keypress="onKeypressAscii"
              @blur="setTouched('old')"
            />
          </v-col>

          <!-- รหัสผ่านใหม่ -->
          <v-col cols="12">
            <span class="detail-text">รหัสผ่านใหม่</span>
            <v-text-field
              :type="showNew ? 'text' : 'password'"
              v-model.trim="form.newPassword"
              placeholder="กรอกรหัสผ่านใหม่"
              v-bind="tfProps"
              :append-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showNew = !showNew"
              :rules="[rules.reqNew, rules.min8New]"
              @keypress="onKeypressAscii"
              @blur="setTouched('new')"
            />
          </v-col>

          <!-- ยืนยันรหัสผ่านใหม่ -->
          <v-col cols="12">
            <span class="detail-text">ยืนยันรหัสผ่านใหม่</span>
            <v-text-field
              :type="showConfirm ? 'text' : 'password'"
              v-model.trim="form.confirmNewPassword"
              placeholder="กรอกยืนยันรหัสผ่านใหม่"
              v-bind="tfProps"
              :append-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showConfirm = !showConfirm"
              :rules="[rules.reqConfirm, rules.matchConfirm]"
              @keypress="onKeypressAscii"
              @blur="setTouched('confirm')"
            />      
          </v-col>
        </v-row>

        <div class="actions mt-6">
          <v-btn
            class="btn-success"
            height="44"
            :loading="saving"
            :disabled="!canSubmit || saving"
            @click="submit"
          >
            บันทึก
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import swalAlert from "@/services/alert/swalServices";
import { changePasswordApi } from "@/services/api/userServices";

export default {
  name: "UpdatePassword",
  data() {
    return {
      valid: false,
      saving: false,
      showOld: false,
      showNew: false,
      showConfirm: false,
      form: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      touched: { old: false, new: false, confirm: false },

      tfProps: { outlined: true, hideDetails: "auto", dense: true },

      rules: {
        reqOld: (v) => !this.touched.old || !!v || "กรุณากรอกข้อมูลให้ครบถ้วน",
        reqNew: (v) => !this.touched.new || !!v || "กรุณากรอกข้อมูลให้ครบถ้วน",
        min8New: (v) =>
          !this.touched.new ||
          String(v || "").length >= 8 ||
          "รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร",
        reqConfirm: (v) =>
          !this.touched.confirm || !!v || "กรุณากรอกข้อมูลให้ครบถ้วน",
        matchConfirm: (v) =>
          !this.touched.confirm ||
          v === this.form.newPassword ||
          "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน",
      },
    };
  },
  computed: {
    canSubmit() {
      return (
        this.form.currentPassword &&
        this.form.newPassword &&
        this.form.confirmNewPassword &&
        String(this.form.newPassword).length >= 8 &&
        this.form.confirmNewPassword === this.form.newPassword
      );
    },
  },
  methods: {
    onKeypressAscii(e) {
      const code = e.key?.charCodeAt(0) ?? 0;
      if (code > 127) e.preventDefault();
    },
    setTouched(key) {
      this.touched[key] = true;
    },

    async submit() {
      this.$refs.form.validate();
      if (!this.canSubmit || this.saving) return;

      this.saving = true;
      try {
        await changePasswordApi({
          currentPassword: this.form.currentPassword,
          newPassword: this.form.newPassword,
          confirmNewPassword: this.form.confirmNewPassword,
        });
        await swalAlert.Success("เปลี่ยนรหัสผ่านสำเร็จ");

        this.form.currentPassword = "";
        this.form.newPassword = "";
        this.form.confirmNewPassword = "";
        this.touched = { old: false, new: false, confirm: false };
        this.$nextTick(() => this.$refs.form.resetValidation());
      } catch (err) {
        const msg =
          err?.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้";
        await swalAlert.Error(msg);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.section-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
}
.section-form {
  padding: 34px;
}
.card-head {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
}
.head-gradient {
  height: 76px;
  opacity: 0.18;
}
.head-gradient--green {
  background: linear-gradient(100deg, #d6230b 0%, #eed7d5 100%);
}
.head-inner {
  padding: 30px 34px 14px;
}
.form-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.subtitle {
  color: #6b7280;
  margin-bottom: 8px;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1f2a39;
  margin-bottom: 4px;
}
:deep(.v-input) {
  margin-bottom: 10px !important;
}
:deep(.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
  border-radius: 10px !important;
  border-color: #e5e7eb !important;
}
:deep(.v-text-field.v-input--dense input) {
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}
.hint-err {
  color: #ef4444;
  font-size: 12.5px;
  line-height: 1.55;
  margin-top: 4px;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn-success {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 160px;
}
:deep(.btn-success.v-btn--disabled) {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  box-shadow: none !important;
  cursor: default !important;
}
@media (max-width: 600px) {
  .section-form {
    padding: 22px;
  }
}
</style>
