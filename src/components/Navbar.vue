<template>
  <div>
    <v-app-bar app flat color="#FFFFFF" class="kg-navbar" fixed>
      <div class="navbar-inner">
        <v-container class="px-6">
          <v-row
            v-if="!isMobile"
            no-gutters
            align="center"
            justify="space-between"
          >
            <v-col
              cols="auto"
              class="d-flex align-center brand-click"
              @click="goHome"
            >
              <v-img
                :src="require('@/assets/logo.png')"
                alt="ELSON"
                class="brand-logo mr-3"
                contain
              />
              <span class="brand-text">ELSONlll</span>
            </v-col>

            <v-col cols="6" class="d-flex align-center justify-center">
              <div class="search-box">
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า ร้านค้า และบริการของเรา"
                  class="search-input"
                />
                <v-btn color="#cf2e18" class="search-btn" dark elevation="0">
                  <v-icon dark>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </v-col>

            <v-col cols="auto" class="d-flex align-center">
              <v-icon class="nav-icon">mdi-cart-outline</v-icon>
              <v-icon class="nav-icon ml-3">mdi-bell-outline</v-icon>

              <v-btn
                v-if="!isLoggedIn"
                class="login-btn ml-4"
                color="#222424"
                dark
                rounded
                height="40"
                @click="goLogin"
              >
                เข้าสู่ระบบ
              </v-btn>

              <v-menu
                v-else
                offset-y
                :nudge-bottom="10"
                :close-on-content-click="true"
                transition="fade-transition"
                attach=".kg-navbar"
                content-class="profile-menu-pop"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="ml-4"
                    v-bind="attrs"
                    v-on="on"
                    height="40"
                    width="40"
                  >
                    <v-avatar size="32">
                      <img
                        v-if="profileImageUrl"
                        :src="profileImageUrl"
                        :alt="currentUser ? currentUser.username : 'avatar'"
                        @error="onAvatarError"
                      />
                      <v-icon v-else>mdi-account-circle</v-icon>
                    </v-avatar>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item @click="goProfile">
                    <v-list-item-icon class="mr-2">
                      <v-icon small>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>บัญชีของฉัน</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="goOrders">
                    <v-list-item-icon class="mr-2">
                      <v-icon small>mdi-receipt-text-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>คำสั่งซื้อของฉัน</v-list-item-title>
                  </v-list-item>

                  <v-divider class="my-1" />

                  <v-list-item @click="logout">
                    <v-list-item-icon class="mr-2">
                      <v-icon small>mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>ออกจากระบบ</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>

          <!-- Mobile / Tablet bar -->
          <v-row
            v-else
            no-gutters
            align="center"
            justify="space-between"
            class="mobile-bar"
          >
            <v-col
              cols="auto"
              class="d-flex align-center brand-click"
              @click="goHome"
            >
              <v-img
                :src="require('@/assets/logo.png')"
                alt="ELSON"
                class="brand-logo mr-2"
                contain
              />
              <span class="brand-text mobile-brand-text">ELSONlll</span>
            </v-col>

            <v-col cols="auto" class="d-flex align-center justify-end">
              <!-- search -->
              <v-btn icon class="mr-1">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>

              <!-- cart -->
              <v-btn icon class="mr-1">
                <v-icon>mdi-cart-outline</v-icon>
              </v-btn>

              <!-- bell -->
              <v-btn icon class="mr-1">
                <v-icon>mdi-bell-outline</v-icon>
              </v-btn>

              <!-- profile (มือถือ) -->
              <!-- ยังไม่ล็อกอิน: ไปหน้าเข้าสู่ระบบ -->
              <v-btn
                v-if="!isLoggedIn"
                icon
                class="mr-1 mobile-avatar-btn"
                @click="goLogin"
              >
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>

              <v-btn
                v-else
                icon
                class="mr-1 mobile-avatar-btn"
                @click="goProfile"
              >
                <v-avatar size="28">
                  <img
                    v-if="profileImageUrl"
                    :src="profileImageUrl"
                    :alt="currentUser ? currentUser.username : 'avatar'"
                    @error="onAvatarError"
                  />
                  <v-icon v-else small>mdi-account-circle</v-icon>
                </v-avatar>
              </v-btn>

              <v-btn icon @click="toggleMobileMenu">
                <v-icon v-if="!mobileMenu">mdi-menu</v-icon>
                <v-icon v-else>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-app-bar>

    <div class="sub-navbar desktop-only">
      <div class="sub-navbar-inner">
        <v-container class="px-6">
          <v-row justify="center" no-gutters class="menu-row">
            <span
              class="menu-item"
              :class="{ active: $route.name === 'home' }"
              @click="goHome"
            >
              หน้าแรก
            </span>

            <span
              class="menu-item"
              :class="{ active: $route.name === 'board' }"
              @click="goBoard"
            >
              กระดานข่าว
            </span>

            <v-menu
              offset-y
              :nudge-bottom="10"
              open-on-hover
              :open-delay="80"
              :close-delay="200"
              transition="fade-transition"
              attach=".sub-navbar"
              content-class="menu-pop"
            >
              <template v-slot:activator="{ on, attrs }">
                <span
                  class="menu-item menu-dd-activator d-flex align-center"
                  tabindex="0"
                  v-bind="attrs"
                  v-on="on"
                >
                  ร้านค้า
                  <v-icon small class="ml-1 menu-icon">
                    mdi-chevron-down
                  </v-icon>
                </span>
              </template>

              <v-list dense class="menu-dd">
                <v-list-item @click="$router.push({ name: 'register_seller' })">
                  <v-list-item-title>เปิดร้านค้า</v-list-item-title>
                </v-list-item>
                <v-list-item @click="goSellerLogin">
                  <v-list-item-title>เข้าสู่ระบบร้านค้า</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <span
              class="menu-item"
              :class="{ active: $route.name === 'delivery' }"
              @click="goDelivery"
            >
              สินค้าเดลิเวอรี่
            </span>

            <v-menu
              offset-y
              :nudge-bottom="10"
              open-on-hover
              :open-delay="80"
              :close-delay="200"
              transition="fade-transition"
              attach=".sub-navbar"
              content-class="menu-pop"
            >
              <template v-slot:activator="{ on, attrs }">
                <span
                  class="menu-item menu-dd-activator d-flex align-center"
                  :class="{ active: $route.name === 'aboutus' }"
                  tabindex="0"
                  v-bind="attrs"
                  v-on="on"
                >
                  เกี่ยวกับเรา
                  <v-icon small class="ml-1 menu-icon">
                    mdi-chevron-down
                  </v-icon>
                </span>
              </template>

              <v-list dense class="menu-dd">
                <v-list-item @click="goServices">
                  <v-list-item-title>บริการของเรา</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-container>
      </div>
    </div>

    <!-- Mobile full-screen menu -->
    <v-expand-transition>
      <div v-if="isMobile && mobileMenu" class="mobile-menu-overlay">
        <div class="mobile-menu-header">
          <v-btn icon @click="toggleMobileMenu">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-list dense>
          <v-list-item @click="handleMobileNav('home')">
            <v-list-item-title>หน้าหลัก</v-list-item-title>
          </v-list-item>

          <v-list-item @click="handleMobileNav('board')">
            <v-list-item-title>กระดานข่าว</v-list-item-title>
          </v-list-item>

          <v-list-item @click="handleMobileNav('delivery')">
            <v-list-item-title>สินค้าเดลิเวอรี่</v-list-item-title>
          </v-list-item>

          <v-list-item @click="handleMobileNav('register_seller')">
            <v-list-item-title>เปิดร้านค้า</v-list-item-title>
          </v-list-item>

          <v-list-item @click="handleMobileNav('login_seller')">
            <v-list-item-title>เข้าสู่ระบบร้านค้า</v-list-item-title>
          </v-list-item>

          <v-list-item @click="handleMobileNav('aboutus')">
            <v-list-item-title>เกี่ยวกับเรา</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { logoutApi } from "@/services/api/auth";
import { getProfileApi } from "@/services/api/userServices";

export default {
  name: "Navbar",
  data() {
    return {
      avatarError: false,
      user: null,
      mobileMenu: false,
    };
  },

  computed: {
    isMobile() {
      const bp = this.$vuetify.breakpoint;
      return bp && bp.width <= 1024;
    },

    isLoggedIn() {
      const s = this.$store;
      return (
        (s && s.getters && s.getters.isAuthenticated) ||
        !!localStorage.getItem("token") ||
        !!localStorage.getItem("vuex")
      );
    },

    currentUser() {
      return (
        (this.$store &&
          this.$store.state &&
          this.$store.state.auth &&
          this.$store.state.auth.user) ||
        this.user ||
        null
      );
    },

    profileImageUrl() {
      if (this.avatarError) return "";
      const user = this.currentUser;
      if (!user || !user.profileImage) return "";
      const raw = (user.profileImage || "").trim();

      if (/^https?:\/\//i.test(raw)) return raw;

      const apiBase = (
        process.env.VUE_APP_API_URL || "http://localhost:3000"
      ).replace(/\/+$/, "");
      return raw.startsWith("/") ? `${apiBase}${raw}` : `${apiBase}/${raw}`;
    },
  },

  watch: {
    profileImageUrl() {
      this.avatarError = false;
    },

    async isLoggedIn(newVal, oldVal) {
      if (newVal && !oldVal) {
        await this.fetchProfile();
      }
    },

    // ล็อก scroll ตอนเปิดเมนูมือถือ
    mobileMenu(val) {
      const body = document.body;
      const html = document.documentElement;
      if (val) {
        body.style.overflow = "hidden";
        html.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
        html.style.overflow = "";
      }
    },
  },

  async created() {
    if (this.isLoggedIn) {
      await this.fetchProfile();
    }
  },

  beforeDestroy() {
    // กันกรณีออกจากหน้าไปแล้ว scroll ยัง lock อยู่
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = "";
    html.style.overflow = "";
  },

  methods: {
    async fetchProfile() {
      try {
        const user = await getProfileApi();
        this.user = user;
        if (this.$store && this.$store.commit) {
          this.$store.commit("auth/SET_USER", user);
        }
        this.avatarError = false;
      } catch (e) {
        console.error("[NAVBAR] getProfile error", e);
      }
    },

    onAvatarError() {
      this.avatarError = true;
    },

    safeGo({ name, params = {}, query = {} }) {
      const sameName = this.$route.name === name;
      const sameParam =
        JSON.stringify(this.$route.params || {}) === JSON.stringify(params);
      const sameQuery =
        JSON.stringify(this.$route.query || {}) === JSON.stringify(query);
      if (sameName && sameParam && sameQuery) return;

      this.$router.push({ name, params, query }).catch((err) => {
        if (!err || err.name !== "NavigationDuplicated") {
          console.error("[NAVBAR] router push error:", err);
        }
      });
    },

    goHome() {
      this.safeGo({ name: "home" });
    },
    goLogin() {
      this.safeGo({ name: "login" });
    },
    goSellerLogin() {
      this.safeGo({ name: "login_seller" });
    },
    goServices() {
      this.safeGo({ name: "aboutus" });
    },
    goDelivery() {
      this.safeGo({ name: "delivery" });
    },
    goBoard() {
      this.safeGo({ name: "board" });
    },
    goProfile() {
      this.safeGo({ name: "profile_user", query: { tab: "profile_info" } });
    },
    goOrders() {
      this.safeGo({ name: "profile_user", query: { tab: "orders_history" } });
    },

    async logout() {
      try {
        await logoutApi().catch(() => {});
      } finally {
        await this.$store.dispatch("logout");
        this.user = null;
        localStorage.removeItem("vuex");
        localStorage.removeItem("token");
        this.safeGo({ name: "login" });
      }
    },

    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },

    handleMobileNav(name) {
      this.mobileMenu = false;
      switch (name) {
        case "home":
          return this.goHome();
        case "board":
          return this.goBoard();
        case "delivery":
          return this.goDelivery();
        case "register_seller":
          return this.$router.push({ name: "register_seller" });
        case "login_seller":
          return this.goSellerLogin();
        case "aboutus":
          return this.goServices();
      }
    },
  },
};
</script>

<style scoped>
.kg-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid #e5e7eb;
  z-index: 30;
}
::v-deep .kg-navbar .v-toolbar__content {
  padding: 0 !important;
  display: flex;
  align-items: center;
}
.navbar-inner,
.sub-navbar-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
  width: 100%;
}
.sub-navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 64px;
  z-index: 20;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
}
.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 8px;
}
.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #cf2e18;
}
.brand-click {
  cursor: pointer;
  transition: opacity 0.2s;
}
.brand-click:hover {
  opacity: 0.85;
}
.search-box {
  width: 100%;
  max-width: 640px;
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 14px;
  font-size: 14px;
  background: transparent;
}
.search-btn {
  min-width: 52px;
  border-radius: 8px;
  margin-right: 3px !important;
}
.nav-icon {
  font-size: 26px;
  color: #111827;
  cursor: pointer;
}
.login-btn {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 4px;
  width: 130px;
}
::v-deep .v-avatar .v-icon {
  color: #111827;
  font-size: 28px;
}
::v-deep .v-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
::v-deep .profile-menu-pop {
  z-index: 3000 !important;
}
.profile-menu-pop ::v-deep .v-list-item__title {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}
.profile-menu-pop ::v-deep .v-list-item__icon {
  color: #cf2e18;
}
.menu-row {
  padding: 8px 0;
  gap: 34px;
}
.menu-item {
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  transition: color 0.2s;
}
.menu-item:hover {
  color: #cf2e18;
}
.menu-item.active {
  color: #cf2e18 !important;
  font-weight: 500;
}
.menu-icon {
  font-size: 16px;
  color: #111827;
  transition: transform 0.2s, color 0.2s;
}
.menu-item:hover .menu-icon {
  color: #cf2e18;
  transform: rotate(180deg);
}
.menu-pop {
  margin-top: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.menu-dd {
  min-width: 200px;
}
.menu-dd ::v-deep .v-list-item {
  min-height: 36px;
}
.menu-dd ::v-deep .v-list-item__title {
  font-size: 14px;
}
.mobile-bar {
  padding: 4px 0;
  min-height: 56px;
}
.mobile-brand-text {
  font-size: 18px;
}
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 200;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.mobile-menu-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
}
.mobile-menu-overlay ::v-deep .v-list {
  padding-top: 0;
}
.mobile-menu-overlay ::v-deep .v-list-item {
  min-height: 52px;
  border-bottom: 1px solid #e5e7eb;
}
.mobile-menu-overlay ::v-deep .v-list-item__title {
  font-size: 16px;
}
.mobile-avatar-btn {
  padding: 0;
}
.mobile-avatar-btn ::v-deep .v-avatar {
  box-shadow: 0 0 0 1px #e5e7eb;
  background: #f9fafb;
}
.mobile-avatar-btn ::v-deep .v-avatar .v-icon {
  font-size: 22px;
  color: #111827;
}
@media (max-width: 1024px) {
  .desktop-only {
    display: none !important;
  }
  .navbar-inner {
    padding: 0 16px;
  }
  .search-box {
    max-width: 100%;
  }
  .menu-row {
    gap: 16px;
    flex-wrap: wrap;
  }
}
@media (max-width: 768px) {
  .navbar-inner,
  .sub-navbar-inner {
    padding: 0 16px;
  }
}
</style>
