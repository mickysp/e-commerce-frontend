<template>
  <div class="login-page">
    <v-card class="section-card" elevation="0">
      <div class="form-container">
        <h2 class="form-title text-center mb-4">เข้าสู่ระบบ</h2>
        <p class="muted text-center mb-6">
          ยินดีต้อนรับกลับ! เข้าสู่ระบบเพื่อดำเนินการต่อ
        </p>

        <v-form ref="form" @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12">
              <span class="detail-text">อีเมล</span>
              <v-text-field
                v-model.trim="email"
                v-bind="tfProps"
                :error="!!emailError"
                :error-messages="emailError"
                placeholder="ระบุอีเมล"
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
                height="40"
                class="btn-primary"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-col>

            <v-col cols="12" class="text-center">
              <p class="terms">
                <router-link class="link-sm" :to="{ name: 'forgotPassword' }">
                  ลืมรหัสผ่าน?
                </router-link>
              </p>
            </v-col>
            <v-col cols="12">
              <div class="divider-with-text"><span>หรือ</span></div>
            </v-col>

            <v-col cols="12" class="btn">
              <v-btn
                block
                height="40"
                class="btn-secondary"
                outlined
                @click="goRegister"
              >
                สร้างบัญชี
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
import { loginApi } from "@/services/api/auth";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "LoginUser",
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
      const lsToken = localStorage.getItem("user_token");
      return this.$store.getters.isAuthenticated || !!lsToken;
    },
  },

  created() {
    if (this.isLoggedIn) this.$router.replace({ name: "home" });

    this.email = this.$route?.query?.email || "";

    const reason = this.$route?.query?.reason;
    if (reason === "session_expired") {
      swalAlert.Error("เซสชันหมดอายุแล้ว", "กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
    }
  },

  methods: {
    goRegister() {
      if (this.$router) this.$router.push({ name: "register" });
      else window.location.href = "/register";
    },
    goForgotPassword() {
      if (this.$router) this.$router.push({ name: "forgotPassword" });
      else window.location.href = "/forgotPassword";
    },
    validateEmail() {
      const v = (this.email || "").trim();
      if (!v) {
        this.emailError = "กรุณากรอกอีเมล";
        return;
      }
      const re = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      this.emailError = re.test(v)
        ? ""
        : "อีเมลต้องอยู่ในรูปแบบ user@example.com";
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
      this.$emit("loading", true);

      try {
        const { token, user, message } = await loginApi({
          email: this.email,
          password: this.password,
        });

        await this.$store.dispatch("loginSuccess", {
          token,
          loginBy: "password",
          user,
        });

        const userRole = user?.role || "user";
        localStorage.setItem("user_token", token);
        localStorage.setItem("user_role", userRole);

        if (this.$socket && user && (user.id || user._id)) {
          const userId = user.id || user._id;
          this.$socket.emit("buyer:join", userId);
        }

        if (message) await swalAlert.Success(message);

        const redirect =
          this.$route.query.redirect || this.$route.query.r || null;

        if (redirect) {
          this.$router.push(redirect);
        } else {
          this.$router.push({ name: "home" });
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล";
        await swalAlert.Error("เข้าสู่ระบบไม่สำเร็จ", msg);
      } finally {
        this.submitting = false;
        this.$emit("loading", false);
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 90dvh;
  display: grid;
  place-items: center;
}
.section-card {
  padding: 40px 24px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
}
.form-container {
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
}
.form-title {
  padding-top: 20px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.muted {
  color: #6b7280;
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
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
:deep(.v-messages__message) {
  font-size: 12px !important;
  line-height: 1.4 !important;
}
.btn {
  padding-bottom: 20px;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 700;
}
.btn-secondary {
  border-radius: 8px !important;
  color: #cf2e18 !important;
  background: #fff !important;
  font-weight: 700;
  border: 1px solid #cf2e18 !important;
}
.btn-secondary:hover {
  background: rgba(207, 46, 24, 0.06) !important;
}
.link-sm {
  color: #111827;
  text-decoration: underline;
  font-size: 13px;
}
.divider-with-text {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 13px;
}
.divider-with-text::before,
.divider-with-text::after {
  content: "";
  height: 1px;
  background: #e5e7eb;
}
</style>
