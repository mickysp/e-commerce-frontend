<template>
  <v-card flat class="profile-edit-card">
    <div class="info-header mb-1">
      <div class="info-title">แก้ไขข้อมูลส่วนตัว</div>
    </div>

    <v-divider class="mb-4"></v-divider>

    <v-form ref="form" v-model="valid">
      <v-row dense>
        <!-- Prefix -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localUser.prefix"
            label="คำนำหน้า"
            :rules="[rules.required]"
            dense
            outlined
          />
        </v-col>

        <!-- First Name -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localUser.firstName"
            label="ชื่อ"
            :rules="[rules.required]"
            dense
            outlined
          />
        </v-col>

        <!-- Last Name -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localUser.lastName"
            label="นามสกุล"
            :rules="[rules.required]"
            dense
            outlined
          />
        </v-col>

        <!-- Email -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="localUser.email"
            label="อีเมล"
            :rules="[rules.required, rules.email]"
            dense
            outlined
          />
        </v-col>

        <!-- Phone -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="localUser.phone"
            label="เบอร์โทรศัพท์"
            :rules="[rules.required]"
            dense
            outlined
          />
        </v-col>

        <!-- Role -->
        <v-col cols="12" sm="6">
          <v-select
            v-model="localUser.role"
            :items="roles"
            label="ตำแหน่ง"
            :rules="[rules.required]"
            dense
            outlined
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Change Password -->
      <div class="section-title mb-2">
        เปลี่ยนรหัสผ่าน <span class="section-sub">(ถ้าต้องการ)</span>
      </div>

      <v-row dense>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="passwords.oldPassword"
            label="รหัสผ่านเดิม"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            dense
            outlined
          />
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model="passwords.newPassword"
            label="รหัสผ่านใหม่"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            :rules="passwordRules"
            dense
            outlined
          />
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model="passwords.confirmPassword"
            label="ยืนยันรหัสผ่านใหม่"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            :rules="confirmPasswordRules"
            dense
            outlined
          />
        </v-col>
      </v-row>

      <v-row class="mt-4" justify="end">
        <v-btn
          text
          class="mr-2 cancel-btn"
          @click="onCancelClick"
        >
          ยกเลิก
        </v-btn>
        <v-btn
          color="primary"
          class="save-btn"
          :loading="saving"
          :disabled="!canSave"
          @click="onSaveClick"
        >
          <v-icon left small>mdi-content-save</v-icon>
          บันทึก
        </v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: "ProfileEditFormCard",
  props: {
    value: {
      type: Object,
      required: true,
    },
    saving: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localUser: { ...this.value },
      originalSnapshot: JSON.stringify(this.value),
      valid: false,
      showPassword: false,
      passwords: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      roles: ["Admin", "Super Admin"],
      rules: {
        required: (v) => !!v || "กรุณากรอกข้อมูล",
        email: (v) => {
          if (!v) return "กรุณากรอกอีเมล";
          const re = /\S+@\S+\.\S+/;
          return re.test(v) || "รูปแบบอีเมลไม่ถูกต้อง";
        },
        minPassword: (v) => {
          if (!v) return true;
          return v.length >= 6 || "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        },
      },
    };
  },
  computed: {
    isDirty() {
      return JSON.stringify(this.localUser) !== this.originalSnapshot;
    },
    passwordRules() {
      return [this.rules.minPassword];
    },
    confirmPasswordRules() {
      return [
        (v) => {
          if (!this.passwords.newPassword && !v) return true;
          return (
            v === this.passwords.newPassword || "รหัสผ่านใหม่ไม่ตรงกัน"
          );
        },
      ];
    },
    canSave() {
      const hasPasswordChange = !!this.passwords.newPassword;
      return this.valid && (this.isDirty || hasPasswordChange) && !this.saving;
    },
  },
  watch: {
    value: {
      deep: true,
      handler(newVal) {
        this.localUser = { ...newVal };
        this.originalSnapshot = JSON.stringify(newVal);
      },
    },
    localUser: {
      deep: true,
      handler(newVal) {
        this.$emit("update:value", { ...newVal });
      },
    },
  },
  methods: {
    onCancelClick() {
      this.localUser = JSON.parse(this.originalSnapshot);
      this.passwords = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      this.$emit("cancel");
    },
    onSaveClick() {
      if (!this.$refs.form) return;

      this.$refs.form.validate();
      if (!this.canSave) return;

      const payload = {
        user: { ...this.localUser },
        passwords: { ...this.passwords },
      };
      this.$emit("save", payload);
    },
  },
};
</script>

<style scoped>
.profile-edit-card {
  border-radius: 18px;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.section-sub {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
}

.cancel-btn {
  text-transform: none;
  color: #6b7280 !important;
}

.save-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
