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
                <span class="no-data-text mb-4">
                  ยังไม่มีรายการผู้ใช้
                </span>
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

              <v-col cols="12">
                <span class="count-data-text">
                  ผู้ใช้ ทั้งหมด {{ filteredUsers.length }} คน
                </span>
              </v-col>

              <v-col cols="12">
                <template v-if="filteredUsers.length > 0">
                  <UserTable
                    :users="filteredUsers"
                    :user-role="$store.getters.getRole"
                    @view="openDetail"
                    @delete="deleteUser"
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

            <UserDialog
              v-model="dialogVisible"
              :user="selectedUser"
            />
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
import { getAdminUsersApi } from "@/services/api/adminServices";

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
        result = result.filter(
          (u) => normalizeStatus(u.status) === target
        );
      }

      if (this.selectedOnlineStatus === "online") {
        result = result.filter((u) => !!u.isOnline);
      } else if (this.selectedOnlineStatus === "offline") {
        result = result.filter((u) => !u.isOnline);
      }

      if ((this.search || "").trim()) {
        const kw = this.search.toLowerCase().trim();

        result = result.filter((u) => {
          const fullName = [
            u.prefix,
            u.firstName,
            u.middleName,
            u.lastName,
          ]
            .map((x) => (x || "").trim())
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const username = (u.username || "").toLowerCase();
          const email = (u.email || "").toLowerCase();

          return (
            fullName.includes(kw) ||
            username.includes(kw) ||
            email.includes(kw)
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
  },

  methods: {
    async loadUsers() {
      this.isLoading = true;
      try {
        const data = await getAdminUsersApi();
        this.users = data.users || [];
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
</style>
