<template>
  <v-navigation-drawer
    permanent
    app
    :width="isMiniVariant ? 76 : 280"
    :mini-variant="isMiniVariant"
    touchless
  >
    <v-list class="pa-0">
      <v-list-item :class="isMiniVariant ? 'd-flex justify-center' : 'd-flex justify-end'">
        <v-btn icon @click="toggleMini">
          <template v-if="isMiniVariant">
            <v-img src="@/assets/open-mini.png" max-width="24" max-height="24" contain />
          </template>
          <template v-else>
            <v-icon color="#cf2e18">mdi-menu</v-icon>
          </template>
        </v-btn>
      </v-list-item>

      <v-list-item class="d-flex justify-center mb-6" v-if="!isMiniVariant">
        <img
          src="@/assets/logo.png"
          width="142"
          alt="EL-SON"
          style="cursor:pointer"
          @click="goToHome()"
        />
      </v-list-item>
    </v-list>

    <!-- Seller Nav -->
    <v-list nav dense>
      <v-list-item
        v-for="(item, i) in filteredListItem"
        :key="i"
        :to="item.path"
        router
        link
        class="mb-2"
        :class="{ 'v-list-item--active': isActive(item) }"
      >
        <v-list-item-icon class="mr-2">
          <v-icon :color="isActive(item) ? '#FFFFFF' : '#6B717F'">
            {{ item.mdi }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content class="pa-0" v-if="!isMiniVariant">
          <v-list-item-title class="mt-1" v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Bottom: notifications + profile + logout -->
    <template v-slot:append>
      <v-list nav dense>
        <!-- Notifications -->
        <template v-if="isMiniVariant">
          <v-list-item class="mb-4" @click="$emit('open-notification')">
            <v-badge :content="notification" color="#E5000B" overlap class="d-flex justify-center">
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item class="mb-4" @click="$emit('open-notification')">
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-bell-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="d-flex align-center">
                <span>การแจ้งเตือน</span>
                <v-chip color="#FFEEEF" class="chip-icon ml-2" text-color="#E5000B">
                  <span v-text="notification"></span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <!-- Profile + Logout -->
        <template v-if="isMiniVariant">
          <v-list-item class="d-flex justify-center mb-4">
            <v-avatar size="40">
              <img :src="profileImage" alt="avatar" />
            </v-avatar>
          </v-list-item>
          <v-list-item class="d-flex justify-center mb-4">
            <v-btn icon @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item>
            <v-avatar size="40" class="mr-2">
              <img :src="profileImage" alt="avatar" />
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span class="profile-title-text">{{ fullname }}</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="profile-subtitle-text">{{ displayRole }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-btn icon @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-list-item>
        </template>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "@/eventBus";

export default {
  name: "Sidebar",
  data() {
    return {
      // ชื่อบทบาทที่แสดงใต้โปรไฟล์
      roleMap: {
        seller: "ผู้ขาย",
        sellerAdmin: "แอดมินร้าน",
        admin: "แอดมินระบบ",
        superAdmin: "Super Admin",
      },
      notification: 0,

      // ✅ เมนูสำหรับ "ระบบผู้ขาย"
      listItem: [
        {
          title: "แดชบอร์ด",
          mdi: "mdi-view-dashboard-outline",
          path: "/seller/dashboard",
          matchPaths: ["/seller/overview"],
        },
        {
          title: "คำสั่งซื้อ",
          mdi: "mdi-receipt-text-outline",
          path: "/seller/orders",
          matchPaths: ["/seller/order-detail", "/seller/returns/create"],
        },
        {
          title: "สินค้า",
          mdi: "mdi-cube-outline",
          path: "/seller/products",
          matchPaths: ["/seller/products/new", "/seller/products/edit", "/seller/variants"],
        },
        {
          title: "สต็อกสินค้า",
          mdi: "mdi-warehouse",
          path: "/seller/inventory",
        },
        {
          title: "โปรโมชัน & คูปอง",
          mdi: "mdi-sale-outline",
          path: "/seller/promotions",
          matchPaths: ["/seller/coupons"],
        },
        {
          title: "แชทลูกค้า",
          mdi: "mdi-chat-outline",
          path: "/seller/messages",
        },
        {
          title: "การขนส่ง",
          mdi: "mdi-truck-delivery-outline",
          path: "/seller/shipping",
          matchPaths: ["/seller/shipping/channels", "/seller/shipping/rates"],
        },
        {
          title: "การคืนสินค้า",
          mdi: "mdi-archive-refresh-outline",
          path: "/seller/returns",
        },
        {
          title: "รีวิวร้านค้า",
          mdi: "mdi-star-outline",
          path: "/seller/reviews",
        },
        {
          title: "การเงิน & การโอนเงิน",
          mdi: "mdi-cash-multiple",
          path: "/seller/finance",
          matchPaths: ["/seller/payouts", "/seller/billing"],
        },
        {
          title: "วิเคราะห์ยอดขาย",
          mdi: "mdi-chart-line",
          path: "/seller/analytics",
        },
        {
          title: "ตั้งค่าร้านค้า",
          mdi: "mdi-store-cog-outline",
          path: "/seller/settings",
          matchPaths: ["/seller/profile", "/seller/staff", "/seller/policies"],
        },
        // เฉพาะสิทธิ์สูง
        {
          title: "จัดการผู้ใช้ร้าน",
          mdi: "mdi-account-cog-outline",
          path: "/seller/staff",
          roles: ["sellerAdmin", "admin", "superAdmin"],
        },
        {
          title: "ศูนย์ความช่วยเหลือ",
          mdi: "mdi-lifebuoy",
          path: "/seller/support",
        },
      ],
    };
  },
  mounted() {
    EventBus.$on("updateUnreadCount", (count) => {
      this.notification = count;
    });
  },
  beforeDestroy() {
    EventBus.$off("updateUnreadCount");
  },
  computed: {
    ...mapState({
      fullname: (state) => state.fullname,
      role: (state) => state.role,            // 'seller' | 'sellerAdmin' | 'admin' | 'superAdmin'
      employee_id: (state) => state.employee_id,
      expanded: (state) => state.expanded,
    }),
    filteredListItem() {
      // แสดงเมนูตาม role (ถ้า item.roles ไม่กำหนด = ทุกคนเห็นได้)
      return this.listItem.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(this.role);
      });
    },
    isMiniVariant: {
      get() {
        return !this.expanded;
      },
      set(value) {
        this.$store.dispatch("setExpanded", !value);
      },
    },
    displayRole() {
      return this.roleMap[this.role] || this.role;
    },
    profileImage() {
      // ใส่ URL รูปโปรไฟล์ผู้ขายของระบบคุณ
      return `https://inet-hr.inet.co.th/api/login/getProfilePicture/${this.employee_id}`;
    },
  },
  methods: {
    async logout() {
      try {
        const res = await this.$axios.get(
          `${this.$domain_api}/api/v1/auth/logout?ts=${Date.now()}`
        );
        if (res.data && res.data.redirectUrl) {
          window.location.href = res.data.redirectUrl;
        }
      } catch (e) {
      } finally {
        localStorage.clear();
      }
    },
    toggleMini() {
      this.isMiniVariant = !this.isMiniVariant;
    },
    isActive(item) {
      const current = this.$route.path || "";
      if (current.startsWith(item.path)) return true;
      if (Array.isArray(item.matchPaths)) {
        return item.matchPaths.some((p) => current.startsWith(p));
      }
      return false;
    },
    goToHome() {
      if (this.$route.path !== "/seller/dashboard") {
        this.$router.push({ path: "/seller/dashboard" });
      }
    },
  },
};
</script>

<style scoped>
.profile-title-text {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #1f2a39 !important;
}
.profile-subtitle-text {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #6b717f !important;
}

/* ข้อความเมนู */
.v-list-item__title {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #6b717f !important;
  line-height: 140% !important;
}

/* ✅ สี Active = #cf2e18 (ตรงตามที่ขอ) */
.v-list-item--active .v-list-item__title {
  color: #ffffff !important;
}
.v-list-item--active {
  background-color: #cf2e18 !important;
  border-radius: 10px !important;
  color: #ffffff !important;
}

/* ลดเส้นขอบ Drawer ของ Vuetify */
.v-navigation-drawer >>> .v-navigation-drawer__border { display: none; }

/* ป้ายตัวเลขแจ้งเตือน */
.chip-icon {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 140% !important;
  color: #d43f3a !important;
  border-radius: 8px !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
}
</style>
