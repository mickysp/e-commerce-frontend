<template>
  <v-container fluid class="pa-0">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <AboutUSBannerDetail />
    <Card />
    <Partners />
    <FormContactUS
      ref="contactForm"
      class="mt-10"
      @submit="handleContactSubmit"
    />
  </v-container>
</template>

<script>
import AboutUSBannerDetail from "@/components/AboutUS/AboutUSBannerDetail.vue";
import Card from "@/components/AboutUS/Card.vue";
import Partners from "@/components/AboutUS/Partners.vue";
import FormContactUS from "@/components/AboutUS/FormContactUS.vue";

import { createContactApi } from "@/services/api/contactServices";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "AboutUS",
  components: { AboutUSBannerDetail, Card, Partners, FormContactUS },
  data() {
    return { isLoading: false };
  },
  methods: {
    async handleContactSubmit(payload) {
      this.isLoading = true;
      try {
        const { success, message, data } = await createContactApi(payload);
        const who = data?.userRef
          ? `ผู้ส่ง (userId): ${data.userRef}`
          : "ผู้เยี่ยมชม";

        if (success) {
          await swalAlert.Success("ส่งข้อความสำเร็จ", `${message}\n${who}`);

          this.$refs.contactForm?.resetForm?.();
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
        await swalAlert.Error("ส่งข้อความไม่สำเร็จ", msg);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  padding: 0 !important;
}
</style>
