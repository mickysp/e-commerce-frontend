<template>
  <v-navigation-drawer
    class="admin-drawer"
    permanent
    app
    touchless
    :width="isMini ? 80 : 280"
    :mini-variant="isMini"
  >
    <div class="header-container">
      <div v-if="!isMini" class="logo-wrapper">
        <div class="logo-text">ELSONlll</div>
      </div>

      <v-btn icon class="hamburger-btn" @click="isMini = !isMini">
        <v-icon color="#2563eb" size="24"> mdi-menu </v-icon>
      </v-btn>
    </div>

    <v-list nav dense class="menu-list">
      <v-list-item
        v-for="item in menus"
        :key="item.to"
        :to="item.to"
        router
        link
        class="menu-item"
        :class="{
          'menu-item--active': isActive(item),
          'menu-item--mini': isMini,
        }"
      >
        <v-list-item-icon class="menu-icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content v-if="!isMini">
          <v-list-item-title class="menu-title">
            {{ item.label }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div v-if="!isMini" class="drawer-footer">
        <v-list dense>
          <v-list-item class="footer-noti" @click="$emit('open-notification')">
            <v-list-item-icon class="footer-noti-icon">
              <v-icon color="#4b5563">mdi-bell-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content class="footer-noti-content">
              <div class="footer-noti-main">
                <span class="footer-noti-text">การแจ้งเตือน</span>

                <v-chip
                  v-if="notificationCount > 0"
                  small
                  pill
                  color="#FFEEEF"
                  text-color="#E5000B"
                  class="footer-noti-chip"
                >
                  {{ notificationDisplay }}
                </v-chip>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="footer-user">
            <v-avatar size="40" class="mr-2">
              <img
                v-if="hasAvatar"
                :src="userAvatar"
                alt="avatar"
                @error="onAvatarError"
              />
              <v-icon v-else size="32" color="#2563eb">
                mdi-account-circle
              </v-icon>
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title class="footer-user-name">
                {{ userName }}
              </v-list-item-title>
              <v-list-item-subtitle class="footer-user-role">
                {{ userRole }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-btn icon @click="$emit('logout')">
              <v-icon color="#3B82F6">mdi-logout</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </div>

      <div v-else class="drawer-footer-mini">
        <v-btn icon class="mb-3" @click="$emit('open-notification')">
          <v-badge
            v-if="notificationCount > 0"
            :content="notificationDisplay"
            color="#E5000B"
            overlap
          >
            <v-icon color="#4b5563">mdi-bell-outline</v-icon>
          </v-badge>
          <v-icon v-else color="#4b5563">mdi-bell-outline</v-icon>
        </v-btn>

        <v-avatar size="36" class="mb-3">
          <img
            v-if="hasAvatar"
            :src="userAvatar"
            alt="avatar"
            @error="onAvatarError"
          />
          <v-icon v-else size="28" color="#2563eb"> mdi-account-circle </v-icon>
        </v-avatar>

        <v-btn icon @click="$emit('logout')">
          <v-icon color="#3B82F6">mdi-logout</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { getAdminProfileApi } from "@/services/api/auth";

export default {
  name: "SidebarAdmin",

  props: {
    notificationCount: {
      type: Number,
      default: 16,
    },
  },

  data() {
    return {
      isMini: false,
      avatarError: false,
      adminProfile: null,
      menus: [
        {
          label: "แดชบอร์ด",
          to: "/admin/dashboard",
          icon: "mdi-view-dashboard-outline",
        },
        {
          label: "จัดการคำสั่งซื้อ",
          to: "/admin/orders",
          icon: "mdi-receipt-text-outline",
        },
        {
          label: "จัดการสินค้า",
          to: "/admin/products",
          icon: "mdi-package-variant-closed",
        },
        {
          label: "จัดการหมวดหมู่",
          to: "/admin/categories",
          icon: "mdi-format-list-bulleted-type",
        },
        {
          label: "จัดการข่าว",
          to: "/admin/boards",
          icon: "mdi-bullhorn-outline",
        },
        {
          label: "จัดการผู้ใช้",
          to: "/admin/users",
          icon: "mdi-account-multiple-outline",
        },
        {
          label: "จัดการผู้ขาย",
          to: "/admin/sellers",
          icon: "mdi-store-outline",
        },
        {
          label: "จัดการผู้ดูแลระบบ",
          to: "/admin/admins",
          icon: "mdi-shield-account-outline",
        },
        {
          label: "โปรไฟล์ของฉัน",
          to: "/admin/profile",
          icon: "mdi-account-circle-outline",
        },
      ],
    };
  },

  computed: {
    userName() {
      if (!this.adminProfile) return "ชื่อผู้ใช้";
      const first = this.adminProfile.firstName || "";
      const last = this.adminProfile.lastName || "";
      const fullName = `${first} ${last}`.trim();
      return fullName || this.adminProfile.username || "ชื่อผู้ใช้";
    },
    userRole() {
      if (!this.adminProfile) return "Admin";
      const map = { superadmin: "Super Admin", admin: "Admin" };
      return map[this.adminProfile.role] || this.adminProfile.role;
    },
    userAvatar() {
      return this.adminProfile?.profileImage || "";
    },
    notificationDisplay() {
      return this.notificationCount > 99 ? "99+" : this.notificationCount;
    },
    hasAvatar() {
      return !!this.userAvatar && !this.avatarError;
    },
  },

  async created() {
    await this.loadAdminProfile();
  },

  methods: {
    async loadAdminProfile() {
      try {
        const data = await getAdminProfileApi();
        this.adminProfile = data.admin || data;
      } catch (e) {
        console.error("[SidebarAdmin] load profile failed:", e);
      }
    },
    isActive(item) {
      return this.$route.path.startsWith(item.to);
    },
    onAvatarError() {
      this.avatarError = true;
    },
  },
};
</script>

<style scoped>
.admin-drawer ::v-deep(.v-navigation-drawer__border) {
  display: none !important;
}
.header-container {
  position: relative;
  padding: 20px 0 16px;
}
.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.logo-text {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #2563eb;
  padding-top: 30px !important;
}
.hamburger-btn {
  position: absolute;
  top: 6px;
  right: 12px;
}
.menu-list {
  padding-top: 10px;
}
.menu-item {
  position: relative;
  border-radius: 8px;
  margin: 6px 10px;
  padding-left: 8px;
  padding-right: 10px;
  min-height: 42px;
  color: #4b5563;
  transition: 0.2s;
}
.menu-item:hover {
  background: #eaf1ff;
}
.menu-item--active {
  background: #3b82f6 !important;
  color: white !important;
}
::v-deep .menu-item.menu-item--mini.menu-item--active {
  width: 40px;
  height: 40px;
  margin: 4px auto;
  padding: 0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-icon {
  margin-right: 10px !important;
}
.menu-title {
  font-size: 15px !important;
  font-weight: 600;
}
.menu-item--mini {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}
.menu-item--mini .menu-icon {
  margin-right: 0 !important;
  justify-content: center;
}
.drawer-footer {
  padding: 8px 6px 10px;
}
.footer-noti {
  min-height: 36px;
  padding: 4px 8px 4px 6px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: 0.2s background;
}
.footer-noti:hover {
  background: #f5f6f8;
  cursor: pointer;
}
.footer-noti-content {
  flex: 0 0 auto;
}
.footer-noti-main {
  display: flex;
  align-items: center;
  gap: 6px;
}
.footer-noti-icon {
  margin-right: 6px !important;
}
.footer-noti-text {
  font-size: 15px !important;
  font-weight: 500;
}
.footer-noti-chip {
  font-size: 12px !important;
  font-weight: 600 !important;
  height: 22px !important;
}
.footer-user {
  padding: 6px 8px 4px;
}
.footer-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2a39;
}
.footer-user-role {
  font-size: 12px;
  color: #6b717f;
}
.drawer-footer-mini {
  padding: 8px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
