<template>
  <div class="profile-page">
    <v-container class="profile-container" fluid>
      <v-row no-gutters class="profile-grid" align="start">
        <v-col cols="12" md="3" class="sidebar-col">
          <div class="sidebar-card">
            <SidebarProfile :current="current" @change="handleChange" />
          </div>
        </v-col>

        <v-col cols="12" md="9" class="content-col">
          <div class="content-card">
            <keep-alive>
              <component
                :is="currentComp"
                :value="currentUser"
                @save="onSave"
                @delete="onDeleteConfirm"
                @continue="onDeleteConfirmed"
                @delete-image="onDeleteImage"
              />
            </keep-alive>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SidebarProfile from "@/components/SidebarProfile.vue";
import FormUpdateProfile from "@/components/ProfileUser/FormUpdateProfile.vue";
import DeleteFormProfile from "@/components/ProfileUser/DeleteFormProfile.vue";
import ManageAddresses from "@/components/ProfileUser/ManageAddresses.vue";
import UpdatePassword from "@/components/ProfileUser/UpdatePassword.vue";
import DeleteProfileContinue from "@/components/ProfileUser/DeleteProfileContinue.vue";
import MyCoins from "@/components/ProfileUser/MyCoins.vue";

import swalAlert from "@/services/alert/swalServices";
import {
  getProfileApi,
  updateProfileApi,
  updateProfileImageApi,
  deleteProfileImageApi,
} from "@/services/api/userServices";

const Placeholder = {
  name: "ProfilePlaceholder",
  props: { label: { type: String, default: "" } },
  template: `
    <div>
      <h3 class="ph-title">{{ label }}</h3>
      <p class="ph-sub">กำลังพัฒนา...</p>
    </div>
  `,
};

export default {
  name: "ProfileUser",
  components: {
    SidebarProfile,
    FormUpdateProfile,
    Placeholder,
    DeleteFormProfile,
    ManageAddresses,
    UpdatePassword,
    DeleteProfileContinue,
    MyCoins,
  },

  data() {
    return {
      current: "profile_info",
      currentUser: null,
      compMap: {
        profile_info: FormUpdateProfile,
        profile_password: UpdatePassword,
        profile_address: ManageAddresses,
        profile_privacy: DeleteFormProfile,
        profile_privacy_continue: DeleteProfileContinue,
        profile_notify: Placeholder,
        orders_tracking: Placeholder,
        orders_favorites: Placeholder,
        wallet_coins: MyCoins,
        orders_history: Placeholder,
        orders_returns: Placeholder,
      },
    };
  },

  computed: {
    currentComp() {
      const Cmp = this.compMap[this.current] || Placeholder;
      if (Cmp === Placeholder) {
        const label = this.menuLabel(this.current);
        return {
          extends: Placeholder,
          propsData: { label },
        };
      }
      return Cmp;
    },
  },

  methods: {
    handleChange(name) {
      if (!name || name === this.current) return;
      this.current = name;
      const q = { ...(this.$route.query || {}), tab: name };
      this.$router.replace({ query: q }).catch(() => {});
    },
    onDeleteConfirm() {
      this.current = "profile_privacy_continue";
      const q = { ...(this.$route.query || {}), tab: this.current };
      this.$router.replace({ query: q }).catch(() => {});
    },
    onDeleteConfirmed() {
      this.current = "profile_privacy_continue";
      const q = { ...(this.$route.query || {}), tab: this.current };
      this.$router.replace({ query: q }).catch(() => {});
    },

    async onSave(payload) {
      try {
        const profile = payload.profile || payload;
        const avatarFile = payload.avatarFile || null;

        const res = await swalAlert.Dialog(
          "ยืนยันการแก้ไขข้อมูล",
          "คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลโปรไฟล์หรือไม่?",
          require("@/assets/alert/save.png"),
          132,
          121,
          "บันทึก",
          "ยกเลิก",
          true
        );

        if (!res.isConfirmed) return;

        const { message, user } = await updateProfileApi(profile);
        let finalUser = user;

        if (avatarFile) {
          try {
            const imgRes = await updateProfileImageApi(avatarFile);
            if (imgRes && imgRes.user) {
              finalUser = imgRes.user;
            }
          } catch (e) {
            console.error("[UPDATE PROFILE IMAGE ERROR]", e);
          }
        }

        this.currentUser = finalUser;

        if (this.$store && this.$store.commit) {
          this.$store.commit("auth/SET_USER", finalUser);
        }

        swalAlert.Success(message || "แก้ไขข้อมูลสำเร็จ");
      } catch (err) {
        console.error("[UPDATE PROFILE ERROR]", err);
        const msg =
          err?.response?.data?.message || "อัปเดตข้อมูลผู้ใช้ไม่สำเร็จ";
        swalAlert.Error(msg);
      }
    },

    async onDeleteImage() {
      try {
        const { message, user } = await deleteProfileImageApi();

        if (user) {
          this.currentUser = user;

          if (this.$store && this.$store.commit) {
            this.$store.commit("auth/SET_USER", user);
          }
        } else if (this.currentUser) {
          this.currentUser = {
            ...this.currentUser,
            profileImage: "",
          };
          if (this.$store && this.$store.commit) {
            this.$store.commit("auth/SET_USER", this.currentUser);
          }
        }

        swalAlert.Success(message || "ลบรูปโปรไฟล์สำเร็จ");
      } catch (err) {
        console.error("[DELETE PROFILE IMAGE ERROR]", err);
        const msg = err?.response?.data?.message || "ไม่สามารถลบรูปโปรไฟล์ได้";
        swalAlert.Error(msg);
      }
    },

    async fetchProfile() {
      try {
        const user = await getProfileApi();
        this.currentUser = user;
      } catch (err) {
        console.error("[GET PROFILE ERROR]", err);
      }
    },

    menuLabel(key) {
      const dict = {
        profile_info: "ข้อมูลส่วนตัว",
        profile_password: "เปลี่ยนรหัสผ่าน",
        profile_address: "ที่อยู่",
        profile_privacy: "การตั้งค่าความเป็นส่วนตัว",
        profile_privacy_continue: "ยืนยันการลบบัญชี",
        profile_notify: "ตั้งค่าการแจ้งเตือน",
        orders_tracking: "ติดตามคำสั่งซื้อ",
        orders_favorites: "บันทึกรายการโปรด",
        wallet_coins: "Coins ของฉัน",
        orders_history: "ประวัติการซื้อ",
        orders_returns: "ยกเลิกสินค้า/คืนเงิน",
      };
      return dict[key] || key;
    },
  },

  mounted() {
    const q = this.$route?.query?.tab;
    if (q && this.compMap[q]) this.current = q;

    this.fetchProfile();
  },
};
</script>

<style scoped>
.profile-page {
  position: relative;
  min-height: calc(100vh - var(--appbar-h, 64px));
  background-color: rgb(245, 245, 245);
  padding: 20px 0 50px;
}
.profile-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: transparent;
}
@media (min-width: 1440px) and (max-width: 1919px) {
  .profile-container {
    max-width: 1200px;
  }
}
@media (min-width: 1920px) {
  .profile-container {
    max-width: 1440px;
  }
}
.profile-grid :deep(.v-col) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.sidebar-col {
  padding-right: 16px !important;
}
.sidebar-card {
  position: sticky;
  top: calc(var(--appbar-h, 64px) + 16px);
  background: #fff;
  border-radius: 16px;
  padding: 12px;
}
@media (max-width: 960px) {
  .sidebar-col {
    padding-right: 0 !important;
  }
  .sidebar-card {
    position: static;
    top: auto;
    margin-bottom: 16px;
  }

  .content-card {
    padding: 16px;
  }
}
</style>
