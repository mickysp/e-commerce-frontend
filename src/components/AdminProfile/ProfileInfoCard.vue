<template>
  <v-card flat class="profile-info-card">
    <div class="info-header">
      <div class="info-title">ข้อมูลส่วนตัว</div>
      <v-btn
        small
        color="primary"
        class="info-edit-btn"
        @click="$emit('edit')"
      >
        <v-icon left small>mdi-pencil</v-icon>
        แก้ไขข้อมูล
      </v-btn>
    </div>

    <v-divider class="mb-4"></v-divider>

    <v-row dense>
      <v-col cols="12" md="6">
        <div class="field-label">ชื่อ - นามสกุล</div>
        <div class="field-value">{{ fullName || "-" }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="field-label">ตำแหน่ง</div>
        <div class="field-value">{{ user.role || "-" }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="field-label">อีเมล</div>
        <div class="field-value">{{ user.email || "-" }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="field-label">เบอร์โทรศัพท์</div>
        <div class="field-value">{{ user.phone || "-" }}</div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "ProfileInfoCard",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    fullName() {
      const p = this.user.prefix || "";
      const f = this.user.firstName || "";
      const l = this.user.lastName || "";
      return [p, f, l].filter(Boolean).join(" ");
    },
  },
};
</script>

<style scoped>
.profile-info-card {
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

.info-edit-btn {
  text-transform: none;
  font-weight: 500;
}

.field-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.field-value {
  font-size: 14px;
  color: #111827;
}
</style>
