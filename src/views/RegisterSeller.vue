<template>
  <v-container fluid class="pa-0 login-container">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <RegisterShop v-if="stage === 'welcome'" @start="goInfo" />

    <div v-else-if="stage === 'info'">
      <Stepper :current-step="1" />
      <RegisterInfo :value="infoForm" @next="handleInfoNext" />
    </div>

    <div v-else-if="stage === 'iden'">
      <Stepper :current-step="2" />
      <RegisterIdenCard @back="stage = 'info'" @next="handleIdenNext" />
    </div>

    <div v-else-if="stage === 'send'">
      <Stepper :current-step="3" />
      <RegisterSend @back="stage = 'iden'" @submit="handleSubmit" />
    </div>
  </v-container>
</template>

<script>
import Stepper from "@/components/RegisterSeller/Stepper.vue";
import RegisterShop from "@/components/RegisterSeller/RegisterShop.vue";
import RegisterInfo from "@/components/RegisterSeller/RegisterInfo.vue";
import RegisterIdenCard from "@/components/RegisterSeller/RegisterIdenCard.vue";
import RegisterSend from "@/components/RegisterSeller/RegisterSend.vue";

import { sellerRegisterApi } from "@/services/api/auth";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "RegisterSeller",
  components: {
    Stepper,
    RegisterShop,
    RegisterInfo,
    RegisterIdenCard,
    RegisterSend,
  },
  data() {
    return {
      isLoading: false,
      stage: "welcome",
      infoForm: {},
      idenForm: {}, 
    };
  },
  methods: {
    goInfo() {
      this.stage = "info";
    },
    handleInfoNext(payload) {
      this.infoForm = payload;
      this.stage = "iden";
    },
    handleIdenNext(payload) {
      this.idenForm = payload;
      this.stage = "send";
    },

    toISODate(d) {
      if (!d) return "";
      const x = new Date(d);
      if (isNaN(x)) return "";
      const yyyy = x.getFullYear();
      const mm = String(x.getMonth() + 1).padStart(2, "0");
      const dd = String(x.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },

    async handleSubmit() {
      try {
        this.isLoading = true;

        const i = this.infoForm || {};
        const k = this.idenForm || {};

        if (i.password !== i.password2) {
          await swalAlert.Error("รหัสผ่านไม่ตรงกัน");
          return;
        }

        // birthDate จาก RegisterIdenCard (day, monthNameTH, year)
        const birthDate = (() => {
          const { day, month, year } = k.birth || {};
          if (!day || !month || !year) return "";
          const months = [
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
          ];
          const idx = months.indexOf(month);
          if (idx < 0) return "";
          const mm = String(idx + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          return `${year}-${mm}-${dd}`;
        })();

        const payload = {
          shopName: i.shopName || "",
          province: i.province || "",
          district: i.district || "",
          subdistrict: i.subdistrict || "",
          postalCode: i.postalCode || "",
          addressDetail: i.addressDetail || "",
          phone: i.phone || "",
          email: (i.email || "").trim(),
          password: i.password || "",
          bankAccountNumber: i.accountNumber || "",
          bankName: i.bankName || "",
          personalInfo: {
            nationalId: k.citizenId || "",
            prefix: k.prefix || "",
            firstName: k.firstName || "",
            lastName: k.lastName || "",
            birthDate: birthDate, // YYYY-MM-DD
            idIssueDate: this.toISODate(k.issueDate) || "",
            idExpireDate: this.toISODate(k.expireDate) || "",
          },
        };

        await sellerRegisterApi(payload);

        await swalAlert.Success("ลงทะเบียนร้านค้าสำเร็จ");
        this.$router.push({ name: "login_seller" });
      } catch (err) {
        const s = err?.response?.status;
        const msg = err?.response?.data?.message || "เกิดข้อผิดพลาด";
        if (s === 400)
          await swalAlert.Error(msg || "กรุณากรอกข้อมูลให้ครบถ้วน");
        else if (s === 401) await swalAlert.Error("กรุณาเข้าสู่ระบบก่อน");
        else if (s === 409) await swalAlert.Error("อีเมลนี้ถูกใช้งานแล้ว");
        else await swalAlert.Error(`ส่งแบบฟอร์มไม่สำเร็จ: ${msg}`);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
