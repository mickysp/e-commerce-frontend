<template>
  <aside class="sidebar-profile">
    <v-list dense nav class="py-2">
      <div class="section">
        <div class="section-head">
          <v-icon class="head-icon">mdi-account-circle</v-icon>
          <span class="head-text">บัญชีของฉัน</span>
        </div>

        <v-list-item
          v-for="it in section1"
          :key="it.name"
          :class="['link-item', { active: isActive(it.name) }]"
          @click="go(it.name)"
        >
          <v-list-item-content>
            <v-list-item-title class="link-text">{{
              it.label
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>

      <div class="section mt-6">
        <div class="section-head">
          <v-icon class="head-icon">mdi-chart-line</v-icon>
          <span class="head-text">การซื้อของฉัน</span>
        </div>

        <v-list-item
          v-for="it in section2"
          :key="it.name"
          :class="['link-item', { active: isActive(it.name) }]"
          @click="go(it.name)"
        >
          <v-list-item-content>
            <v-list-item-title class="link-text">{{
              it.label
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </aside>
</template>

<script>
export default {
  name: "SidebarProfile",
  props: {
    current: { type: String, default: "" },
  },
  data() {
    return {
      section1: [
        { name: "profile_info", label: "ข้อมูลส่วนตัว" },
        { name: "profile_password", label: "เปลี่ยนรหัสผ่าน" },
        { name: "profile_address", label: "ที่อยู่" },
        { name: "profile_privacy", label: "การตั้งค่าความเป็นส่วนตัว" },
        { name: "profile_notify", label: "ตั้งค่าการแจ้งเตือน" },
      ],
      section2: [
        { name: "orders_tracking", label: "ติดตามคำสั่งซื้อ" },
        { name: "orders_favorites", label: "บันทึกรายการโปรด" },
        { name: "wallet_coins", label: "Coins ของฉัน" },
        { name: "orders_history", label: "ประวัติการซื้อ" },
        { name: "orders_returns", label: "ยกเลิกสินค้า/คืนเงิน" },
      ],
    };
  },
  methods: {
    isActive(name) {
      return this.current === name;
    },
    go(name) {
      if (!name) return;

      const q = { ...(this.$route.query || {}), tab: name };

      this.$router
        .replace({ query: q })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          window.location.reload();
        });
    },
  },
};
</script>

<style scoped>
.sidebar-profile {
  width: 100%;
  min-width: 0;
}
.section {
  margin-bottom: 16px;
}
.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 10px;
}
.head-icon {
  color: #cf2e18;
  background: #fff2f1;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  font-size: 18px;
}
.head-text {
  font-weight: 700 !important;
  color: #111827 !important;
  font-size: 16px !important;
  line-height: 1.4 !important;
  font-family: "Noto Sans Thai", sans-serif !important;
}
.link-item {
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin: 2px 0;
  transition: background 0.15s ease, color 0.15s ease;
}
.link-item.active {
  background: #fff2f1;
  border-left: 3px solid #cf2e18;
}
.link-text {
  font-size: 14px !important;
  color: #111827 !important;
  font-family: "Noto Sans Thai", sans-serif !important;
  padding: 5px 0px;
  padding-left: 8px;
  line-height: 1.6;
}

/* ฟอนต์พื้นฐานใน v-list-item */
:deep(.v-list-item__title),
:deep(.v-list-item__content),
:deep(.v-list-item__subtitle),
:deep(.v-list-item__action-text) {
  font-size: 14px !important;
  font-family: "Noto Sans Thai", sans-serif !important;
}
:deep(.v-list-item) {
  min-height: 45px;
  height: auto !important;
  padding: 0 !important;
  align-items: center;
}
</style>
