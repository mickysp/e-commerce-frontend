<template>
  <v-container fluid class="pa-0 login-container">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <Stepper v-model="step" />

    <keep-alive>
      <RegisterBasic
        v-if="step === 1"
        :value="basicForm"
        @next="handleBasicNext"
      />
    </keep-alive>

    <keep-alive>
      <RegisterContact
        v-if="step === 2"
        :value="contactForm"
        :provinces="provinces"
        @input="onContactInput"
        @back="step = 1"
        @next="step = 3"
      />
    </keep-alive>

    <keep-alive>
      <RegisterAccess
        v-if="step === 3"
        :value="accessForm"
        :valid.sync="accessValid"
        @input="onAccessInput"
        @submit="handleAccessSubmit"
        @back="step = 2"
      />
    </keep-alive>
  </v-container>
</template>

<script>
import Stepper from "@/components/RegisterUser/Stepper.vue";
import RegisterBasic from "@/components/RegisterUser/RegisterBasic.vue";
import RegisterContact from "@/components/RegisterUser/RegisterContact.vue";
import RegisterAccess from "@/components/RegisterUser/RegisterAccess.vue";

import { registerApi, } from "@/services/api/auth";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "Register",
  components: { Stepper, RegisterBasic, RegisterContact, RegisterAccess },
  data() {
    return {
      isLoading: false,
      step: 1,
      provinces: [
        "กรุงเทพมหานคร",
        "เชียงใหม่",
        "เชียงราย",
        "ขอนแก่น",
        "นครราชสีมา",
        "ภูเก็ต",
      ],
      basicForm: {
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        birth: { day: null, month: null, year: null },
      },
      contactForm: {
        fullName: "",
        country: {
          code: "TH",
          dial: "66",
          label: "Thailand (+66)",
          flag: "🇹🇭",
        },
        phone: "",
        province: "",
        district: "",
        subdistrict: "",
        postcode: "",
        address: "",
        shipTo: "home",
      },
      accessForm: {
        username: "",
        email: "",
        password: "",
        confirm: "",
        refCode: "",
      },
      accessValid: false,
    };
  },
  methods: {
    handleBasicNext(payload) {
      Object.assign(this.basicForm, payload);

      const fullName = [payload.prefix, payload.firstName, payload.lastName]
        .filter(Boolean)
        .join(" ");
      this.contactForm.fullName = fullName;

      this.step = 2;
    },

    onContactInput(nextObj) {
      Object.assign(this.contactForm, nextObj);
    },

    onAccessInput(nextObj) {
      Object.assign(this.accessForm, nextObj);
    },

    monthToNumber(name) {
      const map = {
        มกราคม: 1,
        กุมภาพันธ์: 2,
        มีนาคม: 3,
        เมษายน: 4,
        พฤษภาคม: 5,
        มิถุนายน: 6,
        กรกฎาคม: 7,
        สิงหาคม: 8,
        กันยายน: 9,
        ตุลาคม: 10,
        พฤศจิกายน: 11,
        ธันวาคม: 12,
      };
      return map[name] || name || "";
    },

    splitFullName(fullName = "") {
      const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
      if (parts.length === 0) return { firstName: "", lastName: "" };
      if (parts.length === 1) return { firstName: parts[0], lastName: "" };
      return {
        firstName: parts.slice(0, -1).join(" "),
        lastName: parts.slice(-1)[0],
      };
    },

    async handleAccessSubmit(payload) {
      Object.assign(this.accessForm, payload);

      const { prefix, firstName, middleName, lastName, gender, birth } =
        this.basicForm;
      const {
        fullName,
        phone,
        province,
        district,
        subdistrict,
        postcode,
        address,
        shipTo,
      } = this.contactForm;
      const { username, email, password, refCode } = this.accessForm;

      const day = String(birth.day || "").padStart(2, "0");
      const monthNum = String(this.monthToNumber(birth.month)).padStart(2, "0");
      const year = String(birth.year || "");
      const birthDate =
        year && monthNum && day ? `${year}-${monthNum}-${day}` : "";

      const addrName = this.splitFullName(fullName);
      const addressType = shipTo === "office" ? "ที่ทำงาน" : "บ้าน";

      const payloadRegister = {
        prefix: prefix || "",
        username: username || "",
        email: (email || "").trim(),
        password: password || "",
        firstName: firstName || "",
        middleName,
        lastName: lastName || "",
        gender: gender || "ไม่ระบุ",
        birthDate,
        profileImage: "",
        inviteCode: (refCode || "").toUpperCase(),
        addresses: [
          {
            prefix: prefix || "",
            firstName: addrName.firstName || firstName || "",
            lastName: addrName.lastName || lastName || "",
            phone: phone || "",
            province: province || "",
            district: district || "",
            subdistrict: subdistrict || "",
            postalCode: postcode || "",
            detail: address || "",
            addressType,
          },
        ],
        defaultAddressIndex: 0,
      };

      this.isLoading = true;
      try {
        const { message } = await registerApi(payloadRegister);
        if (message) await swalAlert.Success(message);

        this.$router.push({
          name: "login",
          query: { email: payloadRegister.email },
        });
      } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message;
        if (status === 409) {
          await swalAlert.Error("สมัครสมาชิกไม่สำเร็จ", msg || "ข้อมูลซ้ำ");
        } else if (status === 400) {
          await swalAlert.Error(
            "สมัครสมาชิกไม่สำเร็จ",
            msg || "ข้อมูลไม่ถูกต้อง"
          );
        } else {
          await swalAlert.Error("สมัครสมาชิกไม่สำเร็จ", "กรุณาลองใหม่อีกครั้ง");
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 60vh;
}
</style>
