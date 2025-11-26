<template>
  <v-container fluid class="admin-page-container admin-profile-page">
    <v-row>
      <v-col cols="12">
        <div class="page-header">
          <div class="page-header-title">โปรไฟล์ของฉัน</div>
          <div class="page-header-subtitle">
            ดูและแก้ไขข้อมูลบัญชีผู้ดูแลระบบของคุณ
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <profile-avatar-card
          class="profile-card mb-4"
          :user="user"
          :loading="loading"
          @change-avatar="onChangeAvatar"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProfileAvatarCard from "@/components/AdminProfile/ProfileAvatarCard.vue";

export default {
  name: "AdminProfile",
  components: {
    ProfileAvatarCard,
  },
  data() {
    return {
      mode: "view",
      loading: false,
      saving: false,
      user: {
        id: null,
        prefix: "คุณ",
        firstName: "Admin",
        lastName: "Demo",
        email: "admin@example.com",
        phone: "0800000000",
        role: "Admin",
        avatarUrl: "",
      },
      originalSnapshot: null,
    };
  },

  created() {
    this.loadProfile();
  },

  methods: {
    async loadProfile() {
      try {
        this.loading = true;
        this.originalSnapshot = JSON.stringify(this.user);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    onCancel() {
      if (this.originalSnapshot) {
        this.user = JSON.parse(this.originalSnapshot);
      }
      this.mode = "view";
    },

    async onChangeAvatar(file) {
      try {
        this.loading = true;
        const url = URL.createObjectURL(file);
        this.user = {
          ...this.user,
          avatarUrl: url,
        };
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-page-container {
  min-height: 100vh;
  padding-top: 24px;
  padding-bottom: 32px;
  background: #f3f6ff;
}
.page-header {
  margin-bottom: 16px;
}
.page-header-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}
.page-header-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-top: 2px;
}
.profile-card {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}
</style>
