<template>
  <v-container fluid class="pa-5">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <template v-if="!isLoading">
      <template v-if="users.length === 0">
        <v-card class="card-container d-flex pa-6" elevation="0">
          <v-row>
            <v-col cols="12">
              <span class="title-text">จัดการผู้ใช้</span>
            </v-col>

            <v-col
              cols="12"
              class="d-flex flex-column align-center justify-center"
              style="min-height: 88vh"
            >
              <div class="d-flex flex-column align-center">
                <v-img>
                  <img
                    src="@/assets/not_exist_search.svg"
                    alt="no-data"
                    width="103"
                    height="103"
                  />
                </v-img>
                <span class="no-data-text mb-4"> ยังไม่มีรายการผู้ใช้ </span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-else>
        <v-card class="card-container pa-2" elevation="0">
          <v-card-title>
            <v-row>
              <v-col
                cols="12"
                md="6"
                class="d-flex align-center justify-center justify-md-start"
              >
                <span class="title-text">จัดการผู้ใช้</span>
              </v-col>

              <v-col
                cols="12"
                md="6"
                class="d-flex align-center justify-center justify-md-end"
              >
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <UserStatsCards
                  :users-data="users"
                  :selected-card-index="selectedCardIndex"
                  @select-card="onSelectCard"
                />
              </v-col>

              <v-col cols="12">
                <UserSelect
                  :search="search"
                  :selected-status="selectedStatus"
                  :selected-online-status="selectedOnlineStatus"
                  @update:search="search = $event"
                  @update:selected-status="selectedStatus = $event"
                  @update:selected-online-status="selectedOnlineStatus = $event"
                  @update:date-range="dateRange = $event"
                />
              </v-col>

              <v-col cols="12" class="d-flex flex-wrap align-center mb-1">
                <span class="age-summary-label mr-2 mb-1">
                  อายุเฉลี่ยของผู้ใช้ในระบบ (จากผลการกรองปัจจุบัน)
                  <span v-if="averageAgeInfo && averageAgeInfo.avg">
                    • {{ averageAgeInfo.avg }} ปี
                  </span>
                </span>

                <template
                  v-if="
                    averageAgeInfo &&
                    averageAgeInfo.buckets &&
                    averageAgeInfo.buckets.length
                  "
                >
                  <v-chip
                    v-for="bucket in averageAgeInfo.buckets"
                    :key="bucket.key"
                    small
                    :color="bucket.color"
                    :text-color="bucket.text"
                    class="age-summary-chip mr-2 mb-1"
                  >
                    <v-icon left small v-if="bucket.icon">
                      {{ bucket.icon }}
                    </v-icon>
                    <!-- ตัวอย่าง: 25–34 ปี (วัยเริ่มทำงาน) • 48% (120 คน) -->
                    {{ bucket.label }} • {{ bucket.percent }}% ({{ bucket.count }} คน)
                  </v-chip>
                </template>

                <span
                  v-else
                  class="no-age-text mb-1"
                >
                  - ไม่มีข้อมูลวันเกิด -
                </span>
              </v-col>

              <v-col cols="12">
                <span class="count-data-text">
                  ผู้ใช้ ทั้งหมด {{ filteredUsers.length }} คน
                </span>
              </v-col>

              <v-col cols="12">
                <template v-if="filteredUsers.length > 0">
                  <UserTable
                    :users="filteredUsers"
                    :user-role="normalizedRole"
                    @view="openDetail"
                    @delete="deleteUser"
                    @toggle-suspend="toggleSuspend"
                  />
                </template>

                <template v-else>
                  <v-row>
                    <v-col
                      cols="12"
                      class="d-flex flex-column align-center justify-center"
                      style="min-height: 45vh"
                    >
                      <div class="d-flex flex-column align-center">
                        <v-img>
                          <img
                            src="@/assets/not_exist_search.svg"
                            alt="no-data"
                            width="103.8px"
                            height="103.8px"
                          />
                        </v-img>
                        <span class="no-data-text mb-4">
                          ไม่พบข้อมูลที่ค้นหา กรุณาลองใหม่อีกครั้ง
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </template>
              </v-col>
            </v-row>

            <UserDialog v-model="dialogVisible" :user="selectedUser" />
          </v-card-text>
        </v-card>
      </template>
    </template>
  </v-container>
</template>

<script>
import UserStatsCards from "@/components/AdminUserManagement/Card.vue";
import UserTable from "@/components/AdminUserManagement/Table.vue";
import UserSelect from "@/components/AdminUserManagement/Select.vue";
import UserDialog from "@/components/AdminUserManagement/Dialog.vue";
import {
  getAdminUsersApi,
  updateAdminUserStatusApi,
} from "@/services/api/adminServices";
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "AdminUserManagement",
  components: { UserStatsCards, UserTable, UserSelect, UserDialog },

  data() {
    return {
      users: [],
      selectedCardIndex: 0,
      isLoading: false,
      search: "",
      selectedStatus: "all",
      selectedOnlineStatus: "all",
      dateRange: [],
      dialogVisible: false,
      selectedUser: null,
    };
  },

  async created() {
    await this.loadUsers();
  },

  computed: {
    normalizedRole() {
      const raw = (this.$store.getters.role || "")
        .toString()
        .trim()
        .toLowerCase();
      return raw;
    },

    filteredUsers() {
      const card = this.getCardByIndex(this.selectedCardIndex);
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      const norm = (t) => (t || "").toString().trim().toLowerCase();

      const normalizeStatus = (status) => {
        const v = norm(status);
        if (v === "active") return "active";
        if (v === "inactive") return "inactive";
        if (["suspended", "ban", "banned", "suspend"].includes(v))
          return "suspended";
        return "unknown";
      };

      let result = [...this.users];

      if (card) {
        const key = card.key;

        if (key === "active") {
          result = result.filter((u) => normalizeStatus(u.status) === "active");
        } else if (key === "new_7d") {
          result = result.filter((u) => {
            if (!u.createdAt) return false;
            const ts = new Date(u.createdAt).getTime();
            return ts >= sevenDaysAgo;
          });
        } else if (key === "inactive") {
          result = result.filter((u) => {
            const s = normalizeStatus(u.status);
            return s === "inactive" || s === "suspended";
          });
        }
      }

      if (this.selectedStatus && this.selectedStatus !== "all") {
        const target = this.selectedStatus;
        result = result.filter((u) => normalizeStatus(u.status) === target);
      }

      if (this.selectedOnlineStatus === "online") {
        result = result.filter((u) => !!u.isOnline);
      } else if (this.selectedOnlineStatus === "offline") {
        result = result.filter((u) => !u.isOnline);
      }

      if ((this.search || "").trim()) {
        const kw = this.search.toLowerCase().trim();

        result = result.filter((u) => {
          const fullName = [u.prefix, u.firstName, u.middleName, u.lastName]
            .map((x) => (x || "").trim())
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const username = (u.username || "").toLowerCase();
          const email = (u.email || "").toLowerCase();

          return (
            fullName.includes(kw) || username.includes(kw) || email.includes(kw)
          );
        });
      }

      if (this.dateRange && this.dateRange.length === 2) {
        let [start, end] = this.dateRange.map((d) => new Date(d));

        if (start > end) [start, end] = [end, start];

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        result = result.filter((u) => {
          if (!u.createdAt) return false;
          const created = new Date(u.createdAt);
          if (isNaN(created)) return false;
          return created >= start && created <= end;
        });
      }

      return result;
    },

    averageAgeInfo() {
      const today = new Date();

      const ages = this.filteredUsers
        .map((u) => {
          if (!u.birthDate) return null;
          const d = new Date(u.birthDate);
          if (isNaN(d.getTime())) return null;

          let age = today.getFullYear() - d.getFullYear();
          const m = today.getMonth() - d.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
            age--;
          }
          return age >= 0 ? age : null;
        })
        .filter((a) => a != null);

      const total = ages.length;
      if (!total) return null;

      const sum = ages.reduce((s, a) => s + a, 0);
      const avg = Math.round(sum / total);

      const baseBuckets = [
        {
          key: "under_18",
          label: "ต่ำกว่า 18 ปี",
          min: 0,
          max: 17,
          color: "#FEF3C7",
          text: "#92400E",
          icon: "mdi-alert-circle-outline",
        },
        {
          key: "18_24",
          label: "18–24 ปี (วัยเรียน / วัยมหาวิทยาลัย)",
          min: 18,
          max: 24,
          color: "#DBEAFE",
          text: "#1D4ED8",
          icon: "mdi-school",
        },
        {
          key: "25_34",
          label: "25–34 ปี (วัยเริ่มทำงาน)",
          min: 25,
          max: 34,
          color: "#E1FAE8",
          text: "#0FAE63",
          icon: "mdi-briefcase",
        },
        {
          key: "35_44",
          label: "35–44 ปี (วัยทำงานเต็มที่)",
          min: 35,
          max: 44,
          color: "#DCFCE7",
          text: "#15803D",
          icon: "mdi-briefcase",
        },
        {
          key: "45_59",
          label: "45–59 ปี (วัยก่อนเกษียณ)",
          min: 45,
          max: 59,
          color: "#E5E7EB",
          text: "#374151",
          icon: "mdi-account-clock-outline",
        },
        {
          key: "60_plus",
          label: "60 ปีขึ้นไป (ผู้สูงอายุ)",
          min: 60,
          max: Infinity,
          color: "#FCE7F3",
          text: "#9D174D",
          icon: "mdi-human-cane",
        },
      ];

      const bucketStats = baseBuckets.map((b) => ({
        ...b,
        count: 0,
      }));

      // แจกอายุลงแต่ละช่วง
      for (const age of ages) {
        const bucket = bucketStats.find((b) => age >= b.min && age <= b.max);
        if (!bucket) continue;
        bucket.count += 1;
      }

      const buckets = bucketStats
        .filter((b) => b.count > 0)
        .map((b) => ({
          key: b.key,
          label: b.label,
          color: b.color,
          text: b.text,
          icon: b.icon,
          count: b.count,
          percent: Math.round((b.count / total) * 100),
        }))
        .sort((a, b) => b.percent - a.percent);

      return {
        avg,
        total,
        buckets,
      };
    },
  },

  methods: {
    async loadUsers() {
      this.isLoading = true;
      try {
        const data = await getAdminUsersApi();
        this.users = (data && data.users) || [];
      } catch (err) {
        console.error("[AdminUserManagement] loadUsers error:", err);
        this.users = [];
      } finally {
        this.isLoading = false;
      }
    },

    onSelectCard(index) {
      this.selectedCardIndex = index;
    },

    getCardByIndex(index) {
      const baseCards = [
        { key: "all" },
        { key: "active" },
        { key: "new_7d" },
        { key: "inactive" },
      ];
      return baseCards[index] || null;
    },

    openDetail(user) {
      this.selectedUser = user;
      this.dialogVisible = true;
    },

    deleteUser(user) {
      console.log("delete user", user);
    },

    async toggleSuspend(user) {
      const me = this.$store?.state?.user?._id || "";
      if (me && user._id === me) {
        await swalAlert.Warning(
          "ไม่สามารถระงับบัญชีตัวเองได้",
          "คุณไม่สามารถระงับบัญชีของตัวเองได้"
        );
        return;
      }

      const isSuspended =
        (user.status || "").toString().trim().toLowerCase() === "suspended";

      const { isConfirmed } = await swalAlert.Confirm({
        title: isSuspended
          ? "ยืนยันการยกเลิกระงับบัญชี"
          : "ยืนยันการระงับบัญชี",
        message: `คุณต้องการ${
          isSuspended ? "เปิดการใช้งานบัญชีของ" : "ระงับบัญชีของ"
        } ${user.firstName || user.username || "-"} ใช่หรือไม่?`,
        icon: "warning",
      });

      if (!isConfirmed) return;

      try {
        const nextStatus = isSuspended ? "active" : "suspended";
        const res = await updateAdminUserStatusApi(user._id, nextStatus);

        this.users = this.users.map((u) =>
          u._id === user._id
            ? { ...u, status: res.user.status, isOnline: res.user.isOnline }
            : u
        );

        await swalAlert.Success(res.message || "อัปเดตสถานะสำเร็จ");
      } catch (err) {
        await swalAlert.Error(
          "เกิดข้อผิดพลาด",
          err?.response?.data?.message ||
            err?.message ||
            "ไม่สามารถอัปเดตสถานะผู้ใช้ได้"
        );
      }
    },
  },
};
</script>

<style scoped>
.title-text {
  font-size: 24px;
  font-weight: 700;
  color: #1f2a39;
}
.card-container {
  border-radius: 16px !important;
  box-shadow: 0 0 2px 0 #1018280d !important;
}
.count-data-text {
  font-size: 16px;
  font-weight: 600;
  color: #394253;
}
.no-data-text {
  font-size: 14px;
  font-weight: 400;
  color: #6b717f;
}
.age-summary-label {
  font-size: 14px;
  font-weight: 400;
  color: #6b717f;
}
.age-summary-chip {
  border-radius: 999px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
}

.no-age-text {
  font-size: 14px;
  font-weight: 400;
  color: #9ca3af;
  margin-left: 4px;
}
</style>
