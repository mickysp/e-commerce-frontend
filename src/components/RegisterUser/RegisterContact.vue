<template>
  <div class="register-contact">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <v-form ref="form" v-model="valid">
          <div class="form-header">
            <div class="step-circle">2</div>
            <h2 class="form-title">ข้อมูลติดต่อ</h2>
          </div>

          <p class="muted mb-4">
            กรุณากรอกรายละเอียดข้อมูลติดต่อให้ครบถ้วน
            เพื่อให้สามารถจัดส่งสินค้าได้อย่างถูกต้องและรวดเร็ว
          </p>

          <v-row>
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> คำนำหน้า</span
              >
              <v-select
                v-model="local.prefix"
                :items="prefixItems"
                v-bind="selProps"
                :rules="[rules.required]"
                placeholder="เลือกคำนำหน้า"
              >
                <template v-slot:append>
                  <img
                    :src="require('@/assets/select/expand_icon.png')"
                    width="16"
                    height="16"
                    class="icon-rotate mt-1"
                  />
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> ชื่อ–นามสกุล</span
              >
              <v-text-field
                v-model.trim="local.fullName"
                v-bind="tfProps"
                :rules="[rules.required]"
                placeholder="กรอกชื่อ–นามสกุล"
              />
            </v-col>

            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span> เบอร์โทรศัพท์</span
              >
              <v-text-field
                v-model.trim="local.phone"
                v-bind="tfProps"
                class="phone-input"
                :rules="[rules.required, rules.phone10]"
                placeholder="กรอกหมายเลขโทรศัพท์"
                maxlength="10"
                counter="10"
                @input="digitsOnly10('phone')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="detail-text"
                ><span class="req">*</span> จังหวัด</span
              >
              <v-text-field
                v-model.trim="local.province"
                v-bind="tfProps"
                :rules="[rules.required]"
                placeholder="กรอกจังหวัด"
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="detail-text"
                ><span class="req">*</span> เขต/อำเภอ</span
              >
              <v-text-field
                v-model.trim="local.district"
                v-bind="tfProps"
                :rules="[rules.required]"
                placeholder="เช่น เมืองเชียงใหม่"
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="detail-text"
                ><span class="req">*</span> แขวง/ตำบล</span
              >
              <v-text-field
                v-model.trim="local.subdistrict"
                v-bind="tfProps"
                :rules="[rules.required]"
                placeholder="เช่น สุเทพ"
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="detail-text"
                ><span class="req">*</span> รหัสไปรษณีย์</span
              >
              <v-text-field
                v-model.trim="local.postcode"
                v-bind="tfProps"
                :rules="[rules.required, rules.postcode]"
                placeholder="เช่น 50200"
                maxlength="5"
                @keypress="onlyNumber"
              />
            </v-col>

            <v-col cols="12">
              <span class="detail-text">ที่อยู่รายละเอียดเพิ่มเติม</span>
              <v-textarea
                v-model.trim="local.address"
                v-bind="tfProps"
                :dense="false"
                placeholder="บ้านเลขที่ / หมู่บ้าน / อาคาร / ซอย / ถนน"
                rows="3"
                auto-grow
              />
            </v-col>

            <v-col cols="12">
              <span class="detail-text"
                ><span class="req">*</span>ค่าเริ่มต้น</span
              >
              <v-radio-group
                v-model="local.shipTo"
                row
                class="rg-compact"
                hide-details="auto"
              >
                <v-radio label="บ้าน" value="home" />
                <v-radio label="ที่ทำงาน" value="office" />
              </v-radio-group>
            </v-col>

            <v-col cols="12" class="mt-3 d-flex justify-space-between">
              <v-btn class="btn-secondary" height="40" @click="$emit('back')">
                ย้อนกลับ
              </v-btn>
              <v-btn class="btn-primary" height="40" @click="submit">
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
  name: "RegisterContact",
  props: {
    value: {
      type: Object,
      default: () => ({
        prefix: "",
        fullName: "",
        phone: "",
        province: "",
        district: "",
        subdistrict: "",
        postcode: "",
        address: "",
        shipTo: "home",
      }),
    },
    provinces: {
      type: Array,
      default: () => [
        "กรุงเทพมหานคร",
        "เชียงใหม่",
        "เชียงราย",
        "ขอนแก่น",
        "นครราชสีมา",
        "ภูเก็ต",
      ],
    },
  },
  data() {
    return {
      valid: false,
      local: { ...this.value },
      prefixItems: ["นาย", "นาง", "นางสาว"],
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        menuProps: { offsetY: true },
        dense: true,
      },
      rules: {
        required: (v) => (!!v && String(v).trim() !== "") || "กรุณากรอกข้อมูล",
        phone10: (v) =>
          /^[0-9]{10}$/.test(v || "") || "กรุณากรอกหมายเลข 10 หลัก",
        postcode: (v) => /^[0-9]{5}$/.test(v || "") || "รหัสไปรษณีย์ไม่ถูกต้อง",
      },
    };
  },

  created() {
    this.local.prefix = "";
    this.local.fullName = "";
  },

  watch: {
    value: {
      deep: true,
      handler(v) {
        this.local = {
          ...(v || {}),
          prefix: this.local.prefix || "",
          fullName: this.local.fullName || "",
        };
      },
    },
  },
  methods: {
    digitsOnly10(key) {
      const raw = (this.local[key] || "").replace(/\D+/g, "");
      this.local[key] = raw.slice(0, 10);
    },
    onlyNumber(e) {
      const c = String.fromCharCode(e.which || e.keyCode);
      if (!/[0-9]/.test(c)) e.preventDefault();
    },
    submit() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.$emit("input", { ...this.local });
      this.$emit("next");
    },
  },
};
</script>

<style scoped>
.register-contact {
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
  background-color: #333333;
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
.btn-secondary {
  background: #f3f4f6 !important;
  color: #111827 !important;
  border-radius: 8px !important;
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
:deep(textarea) {
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}
:deep(.v-textarea textarea) {
  min-height: 72px !important;
  line-height: 1.5 !important;
  padding: 0 !important;
  font-size: 14px !important;
}
:deep(.v-select.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
}
:deep(.v-textarea.v-input--dense .v-input__slot),
:deep(.v-textarea .v-input__slot) {
  min-height: 96px !important;
  height: auto !important;
  padding: 8px 10px !important;
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
.v-select .icon-rotate {
  transition: transform 0.3s ease;
  transform: rotate(0deg);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
.rg-compact :deep(.v-input--selection-controls .v-input__slot) {
  min-height: 28px !important;
  height: 28px !important;
}
.rg-compact :deep(.v-label) {
  font-size: 14px !important;
  line-height: 20px !important;
}
:deep(.v-select__selections),
:deep(.v-text-field__slot),
:deep(.v-label),
:deep(.v-input) {
  font-size: 14px !important;
  line-height: 1.4 !important;
}
.country-select {
  max-width: 200px;
}
.phone-input {
  flex: 1;
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
</style>
