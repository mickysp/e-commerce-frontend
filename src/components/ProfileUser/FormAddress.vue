<template>
  <div class="address-form">
    <v-card class="section-card" elevation="0">
      <v-form ref="form" v-model="valid" class="section-form">
        <v-row>
          <v-col cols="12" sm="4">
            <span class="detail-text">คำนำหน้า</span>
            <v-select
              v-model="form.prefix"
              :items="prefixItems"
              placeholder="เลือกคำนำหน้า"
              v-bind="selProps"
              :rules="[req]"
              @change="onEdit"
            >
              <template v-slot:append>
                <img
                  :src="chev"
                  width="16"
                  height="16"
                  class="icon-rotate mt-1"
                />
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" sm="8">
            <span class="detail-text">ชื่อ–นามสกุล</span>
            <v-text-field
              v-model.trim="form.fullName"
              placeholder="ระบุชื่อ–นามสกุล"
              :rules="[req]"
              v-bind="tfProps"
              @input="onEdit"
            />
          </v-col>

          <v-col cols="12">
            <span class="detail-text">เบอร์โทรศัพท์</span>
            <div class="phone-wrapper">
              <v-text-field
                v-model.trim="form.phone"
                placeholder="ระบุเบอร์โทรศัพท์"
                v-bind="tfProps"
                :rules="[req, phoneRule]"
                class="phone-number"
                maxlength="10"
                @keypress="onKeypressNumber"
                @input="onEdit"
              />
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <span class="detail-text">จังหวัด</span>
            <v-text-field
              v-model.trim="form.province"
              placeholder="ระบุจังหวัด"
              :rules="[req]"
              v-bind="tfProps"
              @input="onEdit"
              @blur="form.province = cleanAddressText(form.province)"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="detail-text">เขต/อำเภอ</span>
            <v-text-field
              v-model.trim="form.district"
              placeholder="ระบุเขต/อำเภอ"
              :rules="[req]"
              v-bind="tfProps"
              @input="onEdit"
              @blur="form.district = cleanAddressText(form.district)"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="detail-text">แขวง/ตำบล</span>
            <v-text-field
              v-model.trim="form.subDistrict"
              placeholder="ระบุแขวง/ตำบล"
              :rules="[req]"
              v-bind="tfProps"
              @input="onEdit"
              @blur="form.subDistrict = cleanAddressText(form.subDistrict)"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="detail-text">รหัสไปรษณีย์</span>
            <v-text-field
              v-model.trim="form.postalCode"
              placeholder="ระบุรหัสไปรษณีย์"
              v-bind="tfProps"
              :rules="[req, postalRule]"
              maxlength="5"
              @keypress="onKeypressNumber"
              @input="onEdit"
            />
          </v-col>

          <v-col cols="12">
            <span class="detail-text">ที่อยู่และรายละเอียดเพิ่มเติม</span>
            <v-textarea
              v-model.trim="form.addressDetail"
              placeholder="เช่น บ้านเลขที่ หมู่ อาคาร ซอย ถนน"
              v-bind="tfAreaProps"
              :rows="3"
              :rules="[req]"
              @input="onEdit"
            />
          </v-col>

          <v-col cols="12">
            <span class="detail-text">ตั้งค่าเริ่มต้น</span>
            <v-radio-group
              v-model="form.defaultType"
              row
              hide-details
              class="mt-1 default-type-group"
              @change="onEdit"
            >
              <v-radio label="บ้าน" value="home" />
              <v-radio label="ที่ทำงาน" value="work" />
            </v-radio-group>
          </v-col>
        </v-row>

        <div class="actions mt-6">
          <v-btn
            class="btn-secondary mr-3"
            height="44"
            outlined
            @click="onCancel"
            :disabled="saving || !isDirty"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            class="btn-primary"
            height="44"
            @click="save"
            :loading="saving"
            :disabled="saving || !isDirty"
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

export default {
  name: "FormAddress",
  props: {
    mode: {
      type: String,
      default: "create",
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: false,
      saving: false,
      hasEdited: false,
      form: this.defaultForm(),
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      tfAreaProps: {
        outlined: true,
        hideDetails: "auto",
        rows: 3,
        autoGrow: true,
        dense: true,
      },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        dense: true,
        menuProps: { offsetY: true },
        "append-icon": "",
      },
      prefixItems: ["นาย", "นาง", "นางสาว", "อื่น ๆ"],
      req: (v) => !!v || "กรุณากรอกข้อมูล",
      phoneRule: (v) =>
        !v ||
        /^[0-9]{10}$/.test(v) ||
        "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)",
      postalRule: (v) =>
        !v ||
        /^[0-9]{5}$/.test(v) ||
        "กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (5 หลัก)",
      chev: require("@/assets/select/expand_icon.png"),
    };
  },

  computed: {
    isDirty() {
      return this.hasEdited;
    },
  },

  watch: {
    mode: {
      immediate: true,
      handler(newVal) {
        if (newVal === "create") {
          this.form = this.defaultForm();
          this.hasEdited = false;
        } else if (newVal === "edit" && this.value) {
          this.hydrateFromValue(this.value);
          this.hasEdited = false;
        }
      },
    },
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.mode === "edit" && val) {
          this.hydrateFromValue(val);
          this.hasEdited = false;
        }
      },
    },
  },

  methods: {
    defaultForm() {
      return {
        prefix: "",
        fullName: "",
        phone: "",
        province: "",
        district: "",
        subDistrict: "",
        postalCode: "",
        addressDetail: "",
        defaultType: null,
      };
    },

    hydrateFromValue(val) {
      const base = this.defaultForm();
      const fullName =
        val.fullName || [val.firstName, val.lastName].filter(Boolean).join(" ");

      this.form = {
        ...base,
        ...val,
        prefix: val.prefix || "",
        fullName,
      };
    },

    onEdit() {
      this.hasEdited = true;
    },

    onKeypressNumber(e) {
      const code = e.key?.charCodeAt(0) ?? 0;
      if (code < 48 || code > 57) e.preventDefault();
    },

    cleanAddressText(text) {
      if (!text) return "";

      return text
        .replace(/จังหวัด/g, "")
        .replace(/อำเภอ/g, "")
        .replace(/เขต/g, "")
        .replace(/ตำบล/g, "")
        .replace(/แขวง/g, "")
        .trim();
    },

    async save() {
      this.$refs.form.validate();
      if (!this.valid || !this.isDirty) return;

      this.saving = true;
      try {
        const payload = this.value
          ? { ...this.value, ...this.form }
          : { ...this.form };

        this.$emit("save", {
          mode: this.mode,
          data: payload,
        });
      } finally {
        this.saving = false;
      }
    },

    async onCancel() {
      if (!this.hasEdited) return;

      const res = await swalAlert.Dialog(
        "ยกเลิกการแก้ไขข้อมูล",
        "คุณต้องการยืนยันยกเลิกการแก้ไขข้อมูลใช่หรือไม่?",
        require("@/assets/alert/cancel.png"),
        120,
        120,
        "ยืนยัน",
        "ยกเลิก",
        true
      );

      if (!res.isConfirmed) return;

      if (this.mode === "edit" && this.value) {
        this.hydrateFromValue(this.value);
      } else {
        this.form = this.defaultForm();
      }

      this.hasEdited = false;
      this.$refs.form && this.$refs.form.resetValidation();

      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
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
.phone-wrapper {
  display: block;
}
.phone-number {
  width: 100%;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 160px;
}
:deep(.btn-primary.v-btn--disabled) {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  box-shadow: none !important;
  cursor: default !important;
}
.btn-secondary {
  background: #ffffff !important;
  color: #4b5563 !important;
  border-radius: 10px !important;
  min-width: 120px;
  border: 1px solid #d1d5db !important;
}
:deep(.btn-secondary.v-btn--disabled) {
  background: #f9fafb !important;
  color: #d1d5db !important;
  border-color: #e5e7eb !important;
}
.v-select .icon-rotate {
  transition: transform 0.25s ease;
  transform: rotate(0);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
:deep(.v-textarea.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  padding: 8px 10px !important;
  border-radius: 10px !important;
  border-color: #e5e7eb !important;
}
:deep(.v-textarea.v-input--dense textarea) {
  font-size: 14px !important;
  line-height: 1.4 !important;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
  padding: 0 !important;
}
:deep(.v-select.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
  border-radius: 10px !important;
  border-color: #e5e7eb !important;
}
:deep(.v-select__selections) {
  min-height: 45px !important;
  height: 45px !important;
  align-items: center !important;
  font-size: 14px !important;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
}
:deep(.v-menu__content .v-list-item__title) {
  font-size: 14px !important;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
}
:deep(.default-type-group .v-input--selection-controls__input + .v-label),
:deep(.default-type-group .v-radio .v-label) {
  font-size: 14px !important;
  color: #1f2a39 !important;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
}
</style>
