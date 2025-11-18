<template>
  <div class="contact">
    <section class="contact-section">
      <v-container>
        <v-row align="start" justify="space-between">
          <!-- ซ้าย: ข้อความ -->
          <v-col cols="12" md="5" class="left-pane">
            <h2 class="title">ติดต่อเราตอนนี้</h2>
            <p class="subtitle">
              เรายินดีให้คำปรึกษาและตอบทุกคำถามเกี่ยวกับบริการของเรา
              <br />
              เบอร์โทร: 097-594-7888
              <br />
              อีเมล : korakot.cr.train@gmail.com
            </p>
          </v-col>

          <!-- ขวา: ฟอร์ม -->
          <v-col cols="12" md="6">
            <div class="form-panel">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <!-- คำนำหน้า -->
                  <v-col cols="12" md="4">
                    <span class="detail-text">คำนำหน้า</span>
                    <v-select
                      v-model="form.prefix"
                      :items="prefixItems"
                      v-bind="selProps"
                      placeholder="เลือกคำนำหน้า"
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

                  <!-- ชื่อ -->
                  <v-col cols="12" md="4">
                    <span class="detail-text">ชื่อ</span>
                    <v-text-field
                      v-model.trim="form.firstName"
                      v-bind="tfProps"
                      :rules="[rules.req]"
                      placeholder="ระบุชื่อ"
                    />
                  </v-col>

                  <!-- นามสกุล -->
                  <v-col cols="12" md="4">
                    <span class="detail-text">นามสกุล</span>
                    <v-text-field
                      v-model.trim="form.lastName"
                      v-bind="tfProps"
                      :rules="[rules.req]"
                      placeholder="ระบุนามสกุล"
                    />
                  </v-col>

                  <!-- อีเมล -->
                  <v-col cols="12">
                    <span class="detail-text">อีเมล</span>
                    <v-text-field
                      v-model.trim="form.email"
                      v-bind="tfProps"
                      :rules="[rules.req, rules.email]"
                      placeholder="ระบุอีเมล"
                    />
                  </v-col>

                  <!-- เบอร์โทรศัพท์ -->
                  <v-col cols="12">
                    <span class="detail-text">เบอร์โทรศัพท์</span>
                    <v-text-field
                      v-model.trim="form.phone"
                      v-bind="tfProps"
                      :rules="[rules.req, rules.phone]"
                      placeholder="กรอกหมายเลขโทรศัพท์"
                      type="tel"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      autocomplete="tel-national"
                      @keypress="onlyNumber"
                      @beforeinput="beforeInputNumeric"
                      @input="digitsOnly('phone')"
                      @paste.prevent="onPasteDigits"
                      @drop.prevent
                    />
                  </v-col>

                  <!-- รายละเอียดการติดต่อ -->
                  <v-col cols="12">
                    <span class="detail-text">รายละเอียดการติดต่อ</span>
                    <v-textarea
                      v-model.trim="form.message"
                      v-bind="tfProps"
                      :rules="[rules.req]"
                      :dense="false"
                      placeholder="ข้อความของคุณ"
                      rows="3"
                      auto-grow
                    />
                  </v-col>

                  <!-- ประเภทการติดต่อ -->
                  <v-col cols="12">
                    <span class="detail-text"
                      ><span class="req">*</span> ประเภทการติดต่อ</span
                    >
                    <v-select
                      v-model="form.contactType"
                      :items="contactTypes"
                      :rules="[rules.req]"
                      v-bind="selProps"
                      placeholder="เลือกประเภทการติดต่อ"
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

                  <!-- ปุ่มส่ง -->
                  <v-col cols="12" class="mt-2">
                    <v-btn
                      block
                      height="40"
                      class="btn-primary"
                      :disabled="!valid"
                      @click="submit"
                    >
                      ส่งข้อความ
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "FormContactUS",
  data() {
    return {
      valid: false,
      emailError: "",
      form: {
        prefix: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        contactType: "",
      },
      prefixItems: ["นาย", "นาง", "นางสาว"],
      contactTypes: ["ทั่วไป", "ฝ่ายขาย", "ฝ่ายเทคนิค", "สมัครงาน", "อื่น ๆ"],
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        menuProps: { offsetY: true },
        dense: true,
      },
      rules: {
        req: (v) => (!!v && String(v).trim() !== "") || "กรุณากรอกข้อมูล",
        email: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim()) ||
          "อีเมลไม่ถูกต้อง",
        phone: (v) =>
          /^\d{6,20}$/.test(String(v || "").trim()) || "กรุณากรอกตัวเลข",
      },
    };
  },

  methods: {
    onlyNumber(e) {
      const code = e.which || e.keyCode;
      const allow =
        (code >= 48 && code <= 57) ||
        (code >= 96 && code <= 105) ||
        [8, 9, 37, 38, 39, 40, 46].includes(code);
      if (!allow) e.preventDefault();
    },
    beforeInputNumeric(e) {
      const t = e.inputType || "";
      if (t && t.startsWith("delete")) return;
      const data = (e.data ?? "").toString();
      if (data && /\D/.test(data)) e.preventDefault();
    },
    digitsOnly(key) {
      this.form[key] = String(this.form[key] || "").replace(/\D+/g, "");
    },
    onPasteDigits(e) {
      const text =
        (e.clipboardData || window.clipboardData).getData("text") || "";
      const digits = text.replace(/\D+/g, "");
      const el = e.target;
      const start = el.selectionStart ?? this.form.phone.length;
      const end = el.selectionEnd ?? this.form.phone.length;
      const value = String(this.form.phone || "");
      this.form.phone = (
        value.slice(0, start) +
        digits +
        value.slice(end)
      ).replace(/\D+/g, "");
    },
    submit() {
      this.$refs.form.validate();
      if (!this.valid) return;
      const payload = {
        prefix: this.form.prefix || null,
        firstName: this.form.firstName?.trim(),
        lastName: this.form.lastName?.trim(),
        email: String(this.form.email || "")
          .trim()
          .toLowerCase(),
        phone: String(this.form.phone || "").trim(),
        message: String(this.form.message || "").trim(),
        contactType: this.form.contactType || "ทั่วไป",
      };
      this.$emit("submit", payload);
    },
    resetForm() {
      this.form = {
        prefix: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        contactType: "",
      };
      this.$refs.form?.resetValidation?.();
    },
  },
};
</script>

<style scoped>
.contact {
  padding-bottom: 100px;
}
.contact-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 60px 40px;
  background: #f9edea;
}
.left-pane {
  padding-right: 32px;
}
.title {
  font-size: 34px !important;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  font-family: "Noto Sans Thai", Arial, sans-serif !important;
}
.subtitle {
  font-size: 16px;
  color: #4b5563;
}
.form-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
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
}
:deep(.v-text-field.v-input--dense input),
:deep(textarea) {
  height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}
:deep(.v-textarea.v-input--dense .v-input__slot),
:deep(.v-textarea .v-input__slot) {
  min-height: 96px !important;
  height: auto !important;
}
:deep(.v-textarea textarea) {
  min-height: 72px !important;
  line-height: 1.5 !important;
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
.v-select .icon-rotate {
  transition: transform 0.3s ease;
  transform: rotate(0);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
}

@media (max-width: 960px) {
  .contact-section {
    padding: 32px 20px;
  }
  .left-pane {
    padding-right: 0;
    margin-bottom: 24px;
    text-align: center;
  }
}
</style>
