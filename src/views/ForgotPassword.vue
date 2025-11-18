<template>
  <v-container fluid class="pa-0 login-container">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <FindEmailPhone v-if="step === 1" @search="goVerify" />

    <VerifyCode
      v-else-if="step === 2"
      :email="email"
      @cancel="backToSearch"
      @verify="goSetPassword"
    />

    <SetPassword
      v-else-if="step === 3"
      :email="email"
      :code="code"
      @cancel="backToVerify"
      @submit="handleSetPassword"
    />
  </v-container>
</template>

<script>
import FindEmailPhone from "@/components/ForgotPassword/FindEmailPhone.vue";
import VerifyCode from "@/components/ForgotPassword/VerifyCode.vue";
import SetPassword from "@/components/ForgotPassword/SetPassword.vue";

export default {
  name: "ForgotPassword",
  components: { FindEmailPhone, VerifyCode, SetPassword },
  data() {
    return {
      isLoading: false,
      step: 1,
      email: "",
      code: "",
    };
  },
  methods: {
    goVerify(email) {
      this.email = email;
      this.step = 2;
    },
    backToSearch() {
      this.step = 1;
      this.code = "";
    },

    goSetPassword(code) {
      this.code = code;
      this.step = 3;
    },
    backToVerify() {
      this.step = 2;
    },

    async handleSetPassword() {
      try {
        this.isLoading = true;
        this.$router.push({ name: "login" });
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
