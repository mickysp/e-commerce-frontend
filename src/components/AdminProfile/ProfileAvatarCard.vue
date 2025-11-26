<template>
  <v-card flat class="profile-avatar-card">
    <v-row align="center" no-gutters>
      <v-col cols="12" sm="4" class="text-center py-6">
        <v-avatar size="96" class="profile-avatar-elevated">
          <v-img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
          />
          <v-icon v-else size="80" color="#9ca3af">mdi-account-circle</v-icon>
        </v-avatar>

        <div class="mt-4">
          <v-btn
            small
            outlined
            rounded
            class="change-avatar-btn"
            :loading="loading"
            @click="triggerFile"
          >
            <v-icon left small>mdi-image-edit</v-icon>
            เปลี่ยนรูปโปรไฟล์
          </v-btn>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="d-none"
            @change="onFileChange"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="8" class="py-6 pl-sm-8 pr-sm-6">
        <div class="profile-main-name">
          {{ fullName }}
        </div>
        <div class="profile-main-role">
          {{ user.role || "-" }}
        </div>

        <div class="profile-main-line mt-3">
          <v-icon small class="mr-2" color="#9ca3af">mdi-email</v-icon>
          <span>{{ user.email || "-" }}</span>
        </div>
        <div class="profile-main-line mt-1">
          <v-icon small class="mr-2" color="#9ca3af">mdi-phone</v-icon>
          <span>{{ user.phone || "-" }}</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "ProfileAvatarCard",
  props: {
    user: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
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
  methods: {
    triggerFile() {
      this.$refs.fileInput && this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.$emit("change-avatar", file);
      }
      // reset value ให้เลือกไฟล์เดิมซ้ำได้
      e.target.value = "";
    },
  },
};
</script>

<style scoped>
.profile-avatar-card {
  border-radius: 18px;
}

.profile-avatar-elevated {
  background: #eef2ff;
}

.profile-main-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.profile-main-role {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.profile-main-line {
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
}

.change-avatar-btn {
  border-color: #d1d5db !important;
  color: #374151 !important;
  text-transform: none;
  font-weight: 500;
}
</style>
