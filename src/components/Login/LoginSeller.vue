<template>
<v-container fluid class="pa-0 login-seller d-flex justify-center align-center">
    <div class="form-container">
      <v-card class="section-card" elevation="0">
        <h2 class="form-title text-center mb-4">
          ลงชื่อเข้าใช้ ระบบหลังบ้านร้านค้า
        </h2>
        <p class="muted text-center mb-6">
          จัดการสินค้า ออเดอร์
          และดูรายงานร้านค้าได้ง่ายในที่เดียวผ่านระบบหลังบ้าน
        </p>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="handleSubmit"
        >
          <v-row>
            <v-col cols="12">
              <span class="detail-text">อีเมล</span>
              <v-text-field
                v-model.trim="form.email"
                v-bind="tfProps"
                placeholder="ระบุอีเมล"
                :rules="[req, emailRule]"
                type="email"
                autocomplete="email"
                @keyup.enter="handleSubmit"
              />
            </v-col>

            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="detail-text">รหัสผ่าน</span>
              </div>

              <v-text-field
                v-model="form.password"
                v-bind="tfProps"
                placeholder="ระบุรหัสผ่าน"
                :append-icon="showPwd ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPwd ? 'text' : 'password'"
                @click:append="showPwd = !showPwd"
                :rules="[req]"
                autocomplete="current-password"
                @keyup.enter="handleSubmit"
              />
            </v-col>

            <v-col cols="12" class="mt-2">
              <v-btn
                block
                height="46"
                class="btn-primary"
                :loading="submitting"
                :disabled="submitting || !valid"
                type="submit"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-col>

            <v-col cols="12" class="text-center mt-4">
              <span class="muted-profile">
                หากยังไม่มีบัญชี?
                <a class="link" @click="goRegister">สมัครที่นี่</a>
              </span>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { sellerLoginApi } from "@/services/api/auth";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "LoginSeller",

  data() {
    return {
      isLoading: false,
      submitting: false,
      valid: false,
      showPwd: false,
      form: {
        email: "",
        password: "",
      },
      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      req: (v) => !!v || "กรุณากรอกข้อมูล",
      emailRule: (v) =>
        !v ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
        "อีเมลต้องอยู่ในรูปแบบ user@example.com",
    };
  },

  created() {
    const isAuth = this.$store.getters.isAuthenticated;
    const storeRole = (this.$store.getters.role || "").toLowerCase();

    const sellerToken = localStorage.getItem("seller_token");
    const sellerRole = (
      localStorage.getItem("seller_role") || ""
    ).toLowerCase();

    const isSellerFromStore = isAuth && storeRole === "seller";
    const isSellerFromLocal = !!sellerToken && sellerRole === "seller";

    if (isSellerFromStore || isSellerFromLocal) {
      this.$router.replace({ name: "seller_dashboard" });
    }
  },

  methods: {
    async handleSubmit() {
      const ok = this.$refs.form.validate();
      if (!ok || this.submitting) return;

      this.submitting = true;
      this.isLoading = true;
      try {
        const { token, seller, message } = await sellerLoginApi({
          email: this.form.email,
          password: this.form.password,
        });

        const sellerRole = (seller.role || "seller").toLowerCase();

        await this.$store.dispatch("loginSuccess", {
          token,
          loginBy: "seller_password",
          user: {
            id: seller.id,
            email: seller.email,
            role: sellerRole,
            username: seller.shopName,
          },
        });

        localStorage.setItem("seller_token", token);
        localStorage.setItem("seller_role", sellerRole);

        if (message) await swalAlert.Success(message);

        const redirect =
          this.$route.query.redirect || this.$route.query.r || null;

        if (redirect) {
          this.$router.push(redirect);
        } else {
          const hasSellerDashboard = this.$router.resolve({
            name: "seller_dashboard",
          }).route.name;
          const target = hasSellerDashboard
            ? { name: "seller_dashboard" }
            : { name: "home" };
          this.$router.push(target);
        }
      } catch (e) {
        const msg = e?.response?.data?.message || "เข้าสู่ระบบร้านค้าไม่สำเร็จ";
        await swalAlert.Error("เกิดข้อผิดพลาด", msg);
      } finally {
        this.submitting = false;
        this.isLoading = false;
      }
    },
    goRegister() {
      this.$router.push({ name: "register_seller" });
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
  margin: 100px auto; 
}
.section-card {
  padding: 50px 24px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.06);
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
.muted-profile {
  font-size: 14px;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1f2a39;
  line-height: 1.4;
  margin-bottom: 6px;
}
:deep(.v-input) {
  margin-bottom: 8px !important;
}
:deep(.v-input--dense .v-input__slot) {
  min-height: 46px !important;
  height: 46px !important;
  padding: 0 10px !important;
}
:deep(.v-text-field.v-input--dense input) {
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
.btn-primary {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 700;
}
.link {
  color: #cf2e18;
  cursor: pointer;
  text-decoration: underline;
}
</style>
