<template>
  <div class="stepper-wrapper">
    <div class="text-center mb-6">
      <h2 class="title mb-2">ลงทะเบียน</h2>
      <p class="subtitle">
        กรุณากรอกข้อมูลให้ครบถ้วนเพื่อลงสมัครสมาชิกกับเรา
        <br />
        ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย
        และใช้เพื่อให้บริการที่เหมาะสมกับคุณที่สุด
      </p>
    </div>

    <div class="stepper-container">
      <v-stepper v-model="localStep" class="elev-0 custom-stepper mb-6" flat>
        <v-stepper-header>
          <v-stepper-step :complete="localStep > 1" :editable="false" :step="1">
            ข้อมูลพื้นฐาน
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="localStep > 2" :editable="false" :step="2">
            ข้อมูลติดต่อ
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :editable="false" :step="3">
            ข้อมูลเข้าใช้งาน
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
    </div>
  </div>
</template>

<script>
export default {
  name: "Stepper",
  props: {
    value: { type: Number, required: true },
  },
  computed: {
    localStep: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", Number(val));
      },
    },
  },
};
</script>

<style scoped>
.stepper-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding-top: 80px;
}
.stepper-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}
.title {
  font-size: 30px !important;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif !important;
}
.subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}
.custom-stepper :deep(.v-stepper__step__step) {
  background: #ffffff !important;
  color: #111827;
  border: 1px solid #c5c6c9;
  cursor: default !important;
}
.custom-stepper :deep(.v-stepper__step--active .v-stepper__step__step) {
  background: #cf2e18 !important;
  color: #ffffff !important;
  border-color: #cf2e18 !important;
}
.custom-stepper :deep(.v-stepper__step--complete .v-stepper__step__step) {
  background: #ef4444 !important;
  color: #ffffff !important;
  border-color: #ef4444 !important;
}
.custom-stepper :deep(.v-stepper__step),
.custom-stepper :deep(.v-stepper__label) {
  pointer-events: none !important;
  transition: none !important;
}
.custom-stepper :deep(.v-stepper__step:hover),
.custom-stepper :deep(.v-stepper__label:hover) {
  background: none !important;
  color: inherit !important;
}
.custom-stepper,
.custom-stepper :deep(.v-sheet),
.custom-stepper :deep(.v-stepper),
.custom-stepper :deep(.v-stepper__header) {
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
}
.custom-stepper :deep(.v-divider) {
  opacity: 0.25;
}
</style>
