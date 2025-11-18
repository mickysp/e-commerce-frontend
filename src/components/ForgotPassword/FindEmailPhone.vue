<template>
  <div class="find-account-page">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <h2 class="form-title mb-2">ค้นหาบัญชีของคุณ</h2>
        <p class="subtitle mb-6">โปรดป้อนอีเมลของคุณเพื่อค้นหาบัญชีของคุณ</p>

        <v-form ref="form" v-model="valid" @submit.prevent="onSearch">
          <v-row>
            <v-col cols="12">
              <span class="detail-text">อีเมล</span>
              <v-text-field
                v-model.trim="query"
                v-bind="tfProps"
                :rules="[rules.required, rules.email]"
                placeholder="ระบุอีเมล"
              />
            </v-col>

            <v-col cols="12" class="mt-2 d-flex justify-end btn-row">
              <v-btn class="btn-secondary" height="40" @click="onCancel">
                ยกเลิก
              </v-btn>
              <v-btn
                class="btn-primary"
                height="40"
                :disabled="!valid"
                type="submit"
                @click="onSearch"
              >
                ค้นหา
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
  name: "FindEmailPhone",

  data() {
    return {
      query: "",
      valid: false,
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      rules: {
        required: (v) => (!!v && String(v).trim() !== "") || "กรุณากรอกข้อมูล",
        email: (v) => {
          const val = String(v || "").trim();
          if (!val) return true;

          const emailValid =
            /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val);
          return emailValid || "อีเมลต้องอยู่ในรูปแบบ user@example.com";
        },
      },
    };
  },
  methods: {
    onCancel() {
      if (this.$emit) this.$emit("cancel");
      if (this.$router) this.$router.back();
    },
    onSearch() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.$emit("search", this.query);
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
