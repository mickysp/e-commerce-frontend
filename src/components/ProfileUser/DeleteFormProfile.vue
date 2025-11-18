<template>
  <div class="profile-form">
    <v-card class="section-card" elevation="0">
      <div class="card-head">
        <div class="head-gradient head-gradient--green" />
        <div class="head-inner">
          <h2 class="form-title">การตั้งค่าความเป็นส่วนตัว</h2>
          <p class="subtitle">
            เมื่อคุณลบบัญชี
            ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้
          </p>
        </div>
      </div>

      <v-divider class="mb-6" />

      <v-form ref="form" v-model="valid" class="section-form pt-0">
        <v-row>
          <v-col cols="12">
            <h3 class="section-subtitle">
              เปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่บริษัทในเครือ
            </h3>

            <v-checkbox
              v-model="shareAgree"
              hide-details
              class="mt-2 share-checkbox"
              :ripple="false"
              color="#cf2e18"
            >
              <template #label>
                <span class="checkbox-label">
                  ยอมรับเพื่อให้ EL-SON
                  ส่งหรือเปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่บริษัทในเครือ
                  เพื่อวัตถุประสงค์ทางการตลาดและการติดต่อสื่อสาร
                  โดยบริษัทในเครือ
                </span>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <h3 class="section-subtitle bolder">ยืนยันขอลบบัญชีผู้ใช้</h3>
            <p v-if="!shareAgree" class="warn-text">
              กรุณายอมรับก่อนดำเนินการลบบัญชี
            </p>
          </v-col>
        </v-row>

        <div class="actions mt-6">
          <v-btn
            class="btn-success"
            height="44"
            :loading="loading"
            :disabled="!shareAgree || loading"
            @click="onDelete"
          >
            ลบ
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "DeleteFormProfile",
  props: {
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: true,
      shareAgree: false,
    };
  },
  methods: {
    onDelete() {
      if (!this.shareAgree || this.loading) return;
      this.$emit("delete", { shareAgree: this.shareAgree });
    },
  },
};
</script>

<style scoped>
.section-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
}
.section-form {
  padding: 34px;
}
.card-head {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
}
.head-gradient {
  height: 76px;
  opacity: 0.18;
}
.head-gradient--green {
  background: linear-gradient(100deg, #d6230b 0%, #eed7d5 100%);
}
.head-inner {
  padding: 30px 34px 14px;
}
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
.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #1f2a39;
}
.section-subtitle.bolder {
  font-weight: 800;
}
.share-checkbox :deep(.v-input--selection-controls__ripple) {
  display: none;
}
.checkbox-label {
  color: #1f2a39;
  font-size: 14px;
  line-height: 1.6;
}
.warn-text {
  color: #ef4444;
  font-size: 13px;
  margin: 6px 0 0;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn-success {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 160px;
}
:deep(.btn-success.v-btn--disabled) {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  box-shadow: none !important;
  cursor: default !important;
}
.btn-success:hover:not(.v-btn--disabled) {
  filter: brightness(0.95);
}
@media (max-width: 600px) {
  .section-form {
    padding: 22px;
  }
}
</style>
