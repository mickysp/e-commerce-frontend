<template>
  <div class="login-page">
    <v-card class="section-card" elevation="0">
      <div class="form-container">
        <h2 class="form-title text-center mb-4">เข้าสู่ระบบผู้ดูแลระบบ</h2>
        <p class="muted text-center mb-6">
          สำหรับผู้ดูแลระบบเท่านั้น กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน
        </p>

        <v-form ref="form" @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <span class="detail-text">ชื่อผู้ใช้หรืออีเมล</span>
              <v-text-field
                v-model.trim="email"
                v-bind="tfProps"
                :error="!!emailError"
                :error-messages="emailError"
                placeholder="ระบุชื่อผู้ใช้หรืออีเมล"
                @input="validateEmail"
              />
            </v-col>

            <v-col cols="12">
              <span class="detail-text">รหัสผ่าน</span>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                v-bind="tfProps"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :error="!!passwordError"
                :error-messages="passwordError"
                placeholder="ระบุรหัสผ่าน"
                @click:append="showPassword = !showPassword"
                @input="validatePassword"
              />
            </v-col>

            <v-col cols="12" class="mt-3">
              <v-btn
                :disabled="!canSubmit || submitting"
                :loading="submitting"
                type="submit"
                block
                height="45"
                class="btn-primary"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-col>

            <v-col cols="12" class="text-center">
              <p class="terms">
                <router-link class="link-sm" :to="{ name: 'login' }">
                  ลืมรหัสผ่าน?
                </router-link>
              </p>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
import { adminLoginApi } from "@/services/api/auth";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "LoginAdmin",

  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      emailError: "",
      passwordError: "",
      submitting: false,
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
    };
  },

  computed: {
    canSubmit() {
      return (
        this.email &&
        this.password &&
        !this.emailError &&
        !this.passwordError &&
        !this.submitting
      );
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    role() {
      return this.$store.getters.role || localStorage.getItem("role") || "user";
    },
  },

  // ถ้า login อยู่แล้ว และเป็น admin/superadmin ให้เด้งเข้า dashboard ทันที
  created() {
    if (this.isLoggedIn && ["admin", "superadmin"].includes(this.role)) {
      this.$router.replace({ name: "admin_dashboard" });
    }
  },

  methods: {
    validateEmail() {
      const v = (this.email || "").trim();
      if (!v) {
        this.emailError = "กรุณากรอกชื่อผู้ใช้หรืออีเมล";
        return;
      }

      if (v.includes("@")) {
        const re = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        this.emailError = re.test(v)
          ? ""
          : "อีเมลต้องอยู่ในรูปแบบ user@example.com";
      } else {
        this.emailError = "";
      }
    },

    validatePassword() {
      const v = this.password || "";
      if (!v) {
        this.passwordError = "กรุณากรอกรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)";
        return;
      }
      this.passwordError =
        v.length >= 8 ? "" : "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรขึ้นไป";
    },

    async onSubmit() {
      this.validateEmail();
      this.validatePassword();
      if (!this.canSubmit) return;
      if (this.submitting) return;

      this.submitting = true;

      try {
        const { token, admin } = await adminLoginApi({
          usernameOrEmail: this.email,
          password: this.password,
        });

        const userRole = admin?.role || "user";

        if (!["admin", "superadmin"].includes(userRole)) {
          await swalAlert.Error(
            "ไม่สามารถเข้าสู่ระบบแอดมินได้",
            "บัญชีนี้ไม่ได้รับสิทธิ์ผู้ดูแลระบบ"
          );
          this.submitting = false;
          return;
        }

        const user = {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName || "",
          lastName: admin.lastName || "",
          role: userRole,
          lastLoginAt: admin.lastLoginAt,
        };

        await this.$store.dispatch("loginSuccess", {
          token,
          loginBy: "admin",
          user,
        });

        await swalAlert.Success("เข้าสู่ระบบสำเร็จ");

        // ⬇️ หลัง login เสร็จ ให้เข้า Dashboard และเคลียร์ history หน้า login
        this.$router.replace({ name: "admin_dashboard" });
      } catch (err) {
        const msg = "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล";
        await swalAlert.Error("เข้าสู่ระบบไม่สำเร็จ", msg);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 60px - 60px);
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: #f3f4f6;
}
.section-card {
  padding: 40px 32px;
  background: linear-gradient(145deg, #ffffff, #f3f4ff);
  border-radius: 16px;
  max-width: 660px !important;
  width: 100%;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.4);
}
@media (min-width: 1440px) {
  .section-card {
    max-width: 600px;
  }
}
.form-container {
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
}
.form-title {
  padding-top: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.muted {
  color: #6b7280;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 4px;
}
:deep(.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
  background: #f9fafb !important;
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
.v-text-field--outlined >>> fieldset {
  border-color: #d1d5db !important;
  border-radius: 10px !important;
}
:deep(.v-input--is-focused .v-input__slot fieldset) {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.15);
}
:deep(.v-messages__message) {
  font-size: 12px !important;
  line-height: 1.4 !important;
}
.btn-primary {
  background: #2e6cf3 !important;
  color: #ffffff !important;
  border-radius: 999px !important;
  font-weight: 700;
}
.btn-primary:hover {
  background: #1d4ed8 !important;
}
.link-sm {
  color: #363636;
  text-decoration: underline;
  font-size: 13px;
}
.link-sm:hover {
  color: #222222;
}
.terms {
  margin-top: 16px;
  color: #9ca3af;
}
</style>