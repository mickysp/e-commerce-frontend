<template>
  <div class="profile-form">
    <v-card class="section-card" elevation="0">
      <div class="head-gradient head-gradient--green" />
      <div class="card-head">
        <div class="head-inner">
          <h2 class="form-title">ข้อมูลของฉัน</h2>
          <p class="subtitle">
            จัดการข้อมูลส่วนตัวของคุณเพื่อความปลอดภัยของบัญชีผู้ใช้
          </p>
        </div>
      </div>

      <v-divider class="mb-4"></v-divider>

      <v-form ref="form" v-model="valid" class="section-form">
        <v-row>
          <v-col cols="12">
            <div class="profile-header-row">
              <div class="avatar-wrap" @click="onAvatarClick">
                <template v-if="preview">
                  <img :src="preview" alt="profile" @error="onImgError" />
                </template>
                <template v-else>
                  <div class="avatar-placeholder">
                    <v-icon size="32">mdi-account-outline</v-icon>
                  </div>
                </template>
              </div>

              <div class="avatar-info">
                <div class="avatar-title">รูปโปรไฟล์</div>
                <div class="avatar-sub">
                  แนะนำรูปสี่เหลี่ยมจัตุรัส ขนาดไม่เกิน 1MB (.JPG, .PNG)
                </div>
                <div class="avatar-actions">
                  <span class="link-text" @click="$refs.uploader.click()">
                    {{ preview ? "เปลี่ยนรูปภาพ" : "อัปโหลดรูปภาพ" }}
                  </span>
                  <span v-if="preview" class="divider">|</span>
                  <span
                    v-if="preview"
                    class="link-text danger"
                    @click="removePic"
                  >
                    ลบรูปภาพ
                  </span>
                </div>
              </div>
            </div>

            <input
              ref="uploader"
              type="file"
              accept="image/png,image/jpeg"
              class="hidden-input"
              @change="onPick"
            />
          </v-col>

          <!-- username -->
          <v-col cols="12">
            <span class="detail-text">ชื่อผู้ใช้</span>
            <v-text-field
              v-model.trim="form.username"
              placeholder="ระบุชื่อผู้ใช้"
              v-bind="tfProps"
              :rules="[req]"
              @input="onEdit"
            />
          </v-col>

          <!-- prefix + firstName + lastName -->
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
          <v-col cols="12" sm="4">
            <span class="detail-text">ชื่อ</span>
            <v-text-field
              v-model.trim="form.firstName"
              placeholder="ระบุชื่อ"
              v-bind="tfProps"
              :rules="[req]"
              @input="onEdit"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <span class="detail-text">นามสกุล</span>
            <v-text-field
              v-model.trim="form.lastName"
              placeholder="ระบุนามสกุล"
              v-bind="tfProps"
              :rules="[req]"
              @input="onEdit"
            />
          </v-col>

          <!-- email -->
          <v-col cols="12">
            <span class="detail-text">อีเมล</span>
            <v-text-field
              v-model.trim="form.email"
              placeholder="ระบุอีเมล"
              v-bind="tfProps"
              :rules="[req, emailRule]"
              @keypress="onKeypressAscii"
              @input="onEdit"
            />
          </v-col>

          <!-- gender -->
          <v-col cols="12">
            <span class="detail-text">เพศ</span>
            <v-radio-group
              v-model="form.gender"
              row
              hide-details
              class="mt-0 gender-group"
              @change="onEdit"
            >
              <v-radio value="ชาย" label="ชาย" />
              <v-radio value="หญิง" label="หญิง" />
              <v-radio value="อื่นๆ" label="อื่นๆ" />
            </v-radio-group>
          </v-col>

          <!-- birth date -->
          <v-col cols="12" sm="4">
            <span class="detail-text">วัน</span>
            <v-select
              v-model="form.birth.day"
              :items="days"
              placeholder="เลือกวัน"
              v-bind="selProps"
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
          <v-col cols="12" sm="4">
            <span class="detail-text">เดือน</span>
            <v-select
              v-model="form.birth.month"
              :items="months"
              placeholder="เลือกเดือน"
              v-bind="selProps"
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
          <v-col cols="12" sm="4">
            <span class="detail-text">ปีเกิด</span>
            <v-select
              v-model="form.birth.year"
              :items="years"
              placeholder="เลือกปีเกิด"
              v-bind="selProps"
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
            @click="onSubmit"
            :loading="saving"
            :disabled="saving || !isDirty"
          >
            บันทึก
          </v-btn>
        </div>
      </v-form>

      <v-dialog v-model="avatarDialog" max-width="1000">
        <v-card class="avatar-dialog-card">
          <div class="avatar-dialog-header">
            <span class="avatar-dialog-title"></span>
            <v-btn icon small @click="avatarDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="avatar-dialog-body">
            <template v-if="preview">
              <img
                :src="preview"
                alt="profile-large"
                class="avatar-dialog-image"
                @error="onImgError"
              />
            </template>
            <template v-else>
              <div class="avatar-dialog-empty">
                ยังไม่มีรูปโปรไฟล์ กรุณาอัปโหลดรูปภาพก่อน
              </div>
            </template>
          </div>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "FormUpdateProfile",
  props: {
    value: {
      type: Object,
      default: null,
    },
  },

  data() {
    const yearNow = new Date().getFullYear();
    return {
      valid: false,
      saving: false,
      hasEdited: false,
      avatarDialog: false,
      form: {
        username: "",
        prefix: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "หญิง",
        birth: { day: null, month: null, year: null },
        avatarFile: null,
      },
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      selProps: {
        outlined: true,
        hideDetails: "auto",
        dense: true,
        menuProps: { offsetY: true },
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
      emailRule: (v) =>
        !v ||
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v) ||
        "อีเมลต้องอยู่ในรูปแบบ user@example.com",
      chev: require("@/assets/select/expand_icon.png"),
      preview: "",
    };
  },

  computed: {
    isDirty() {
      return this.hasEdited;
    },
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(user) {
        if (!user) return;
        this.fillFormFromUser(user);
        this.hasEdited = false;
      },
    },
  },

  deactivated() {
    if (this.value) {
      this.fillFormFromUser(this.value);
    }
    this.hasEdited = false;
  },

  beforeDestroy() {
    if (this.preview && this.preview.startsWith("blob:")) {
      URL.revokeObjectURL(this.preview);
    }
  },

  methods: {
    onAvatarClick() {
      if (this.preview) {
        this.avatarDialog = true;
        return;
      }
      if (this.$refs.uploader) {
        this.$refs.uploader.click();
      }
    },

    onEdit() {
      this.hasEdited = true;
    },

    onKeypressAscii(e) {
      const code = e.key?.charCodeAt(0) ?? 0;
      if (code > 127) e.preventDefault();
    },

    fillFormFromUser(user) {
      this.form.username = user.username || "";
      this.form.prefix = user.prefix || "";
      this.form.firstName = user.firstName || "";
      this.form.lastName = user.lastName || "";
      this.form.email = user.email || "";
      this.form.gender = user.gender || "หญิง";

      if (user.birthDate) {
        const [y, m, d] = user.birthDate.split("-");
        const monthIndex = Number(m) - 1;
        this.form.birth.year = Number(y) || null;
        this.form.birth.day = Number(d) || null;
        this.form.birth.month = this.months[monthIndex] || null;
      } else {
        this.form.birth = { day: null, month: null, year: null };
      }

      if (this.preview && this.preview.startsWith("blob:")) {
        URL.revokeObjectURL(this.preview);
      }
      this.form.avatarFile = null;

      if (user.profileImage) {
        const raw = user.profileImage || "";
        const base = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");
        const fullUrl = raw.startsWith("http")
          ? raw
          : base + (raw.startsWith("/") ? raw : `/${raw}`);

        this.preview = fullUrl;
      } else {
        this.preview = "";
      }

      if (this.$refs.uploader) {
        this.$refs.uploader.value = "";
      }
    },

    resetDirtyIfReverted() {
      const u = this.value || {};
      const birthDate = this.buildBirthDate() || "";
      const origBirthDate = u.birthDate || "";

      const sameCore =
        (this.form.username || "") === (u.username || "") &&
        (this.form.prefix || "") === (u.prefix || "") &&
        (this.form.firstName || "") === (u.firstName || "") &&
        (this.form.lastName || "") === (u.lastName || "") &&
        (this.form.email || "") === (u.email || "") &&
        (this.form.gender || "หญิง") === (u.gender || "หญิง") &&
        birthDate === origBirthDate;

      const raw = u.profileImage || "";
      const base = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");
      const fullUrl = raw
        ? raw.startsWith("http")
          ? raw
          : base + (raw.startsWith("/") ? raw : `/${raw}`)
        : "";

      const samePreview = (this.preview || "") === fullUrl;
      const sameAvatar = !this.form.avatarFile;

      if (sameCore && samePreview && sameAvatar) {
        this.hasEdited = false;
      }
    },

    onPick(e) {
      const f = e.target.files?.[0];
      if (!f) return;

      const okType = ["image/jpeg", "image/png"].includes(f.type);
      const okSize = f.size <= 1024 * 1024;
      if (!okType) {
        this.$emit("error", "อนุญาตเฉพาะไฟล์รูปภาพ .JPG หรือ .PNG เท่านั้น");
        e.target.value = "";
        return;
      }
      if (!okSize) {
        this.$emit("error", "ไฟล์มีขนาดเกิน 1MB");
        e.target.value = "";
        return;
      }

      if (this.preview && this.preview.startsWith("blob:")) {
        URL.revokeObjectURL(this.preview);
      }

      this.form.avatarFile = f;
      this.preview = URL.createObjectURL(f);
      this.onEdit();
      e.target.value = "";
    },

    onImgError() {
      console.warn("[PROFILE IMAGE] load error:", this.preview);

      if (this.preview && this.preview.startsWith("blob:")) {
        URL.revokeObjectURL(this.preview);
      }
      this.preview = "";
      this.form.avatarFile = null;

      if (this.$refs.uploader) {
        this.$refs.uploader.value = "";
      }

      this.$emit("error", "ไม่พบรูปโปรไฟล์เดิมในระบบ กรุณาอัปโหลดรูปใหม่");
    },

    buildBirthDate() {
      const { day, month, year } = this.form.birth || {};
      if (!day || !month || !year) return "";
      const monthIndex = this.months.indexOf(month);
      if (monthIndex === -1) return "";
      const mm = String(monthIndex + 1).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      const yyyy = String(year);
      return `${yyyy}-${mm}-${dd}`;
    },

    async removePic() {
      const res = await swalAlert.Dialog(
        "ยืนยันการลบรูปภาพ",
        "คุณต้องการลบรูปภาพนี้หรือไม่?",
        require("@/assets/alert/delete.svg"),
        120,
        120,
        "ลบรูป",
        "ยกเลิก",
        true
      );

      if (!res.isConfirmed) return;

      if (this.form.avatarFile) {
        if (this.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(this.preview);
        }

        this.form.avatarFile = null;

        if (this.value?.profileImage) {
          const raw = this.value.profileImage || "";
          const base = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");
          const fullUrl = raw.startsWith("http")
            ? raw
            : base + (raw.startsWith("/") ? raw : `/${raw}`);

          this.preview = fullUrl;
        } else {
          this.preview = "";
        }

        if (this.$refs.uploader) this.$refs.uploader.value = "";

        this.resetDirtyIfReverted();

        return;
      }

      if (this.preview) {
        this.onEdit();
        this.$emit("delete-image");
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

      if (this.value) {
        this.fillFormFromUser(this.value);
      }

      this.hasEdited = false;
    },

    onSubmit() {
      this.$refs.form.validate();

      const birthDate = this.buildBirthDate();

      const profilePayload = {
        username: this.form.username,
        prefix: this.form.prefix,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        gender: this.form.gender,
        birthDate: birthDate || undefined,
      };

      this.$emit("save", {
        profile: profilePayload,
        avatarFile: this.form.avatarFile || null,
      });
    },
  },
};
</script>

<style scoped>
.section-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
}
.section-form {
  padding: 24px 28px 28px;
}
.card-head {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px 28px 12px;
  border-bottom: 1px solid #f3f4f6;
}
.head-gradient {
  height: 76px;
  opacity: 0.18;
}
.head-gradient--green {
  background: linear-gradient(100deg, #d6230b 0%, #eed7d5 100%);
}
.head-inner {
  padding: 0;
}
.form-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 0;
  font-size: 14px;
}
.profile-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0 20px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 12px;
}
.avatar-wrap {
  width: 80px;
  height: 80px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.1s;
}
.avatar-wrap:hover {
  border-color: #d1d5db;
  background: #f3f4f6;
  transform: translateY(-1px);
}
.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.avatar-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}
.avatar-sub {
  font-size: 13px;
  color: #9ca3af;
}
.avatar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.hidden-input {
  display: none;
}
.link-text {
  font-size: 14px;
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.2s, text-decoration 0.2s;
}
.link-text:hover {
  color: #2563eb;
  text-decoration: underline;
}
.link-text.danger {
  color: #f05252;
}
.link-text.danger:hover {
  color: #dc2626;
  text-decoration: underline;
}

.divider {
  color: #d1d5db;
  font-size: 14px;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}
:deep(.v-input) {
  margin-bottom: 10px !important;
}
:deep(.v-input--dense .v-input__slot) {
  min-height: 44px !important;
  height: 44px !important;
  padding: 0 10px !important;
  border-radius: 10px !important;
  border-color: #e5e7eb !important;
  background: #ffffff !important;
}
:deep(.v-text-field.v-input--dense input) {
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}
:deep(.v-select.v-input--dense .v-input__slot) {
  min-height: 44px !important;
  height: 44px !important;
  padding: 0 10px !important;
}
:deep(.v-select__selections) {
  min-height: 44px !important;
  height: 44px !important;
  align-items: center !important;
  font-size: 14px !important;
}
.actions {
  display: flex;
  justify-content: flex-end;
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
.btn-primary {
  background: #cf2e18 !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  min-width: 160px;
}

:deep(.btn-primary.v-btn--disabled) {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  box-shadow: none !important;
  cursor: default !important;
}
.v-select .icon-rotate {
  transition: transform 0.25s ease;
  transform: rotate(0);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
:deep(.gender-group .v-radio .v-label),
:deep(.gender-group .v-input--selection-controls__input + .v-label) {
  font-size: 14px !important;
  color: #1f2a39 !important;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
}
.avatar-dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}
.avatar-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}
.avatar-dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}
.avatar-dialog-body {
  padding: 16px;
}
.avatar-dialog-image {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  background: #000000;
}
@media (max-width: 600px) {
  .section-form {
    padding: 20px 16px 24px;
  }
  .card-head {
    padding: 18px 16px 10px;
  }
  .profile-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
