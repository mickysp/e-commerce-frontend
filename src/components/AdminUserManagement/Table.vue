<template>
  <v-row>
    <v-col cols="12">
      <v-card class="card-container" elevation="0">
        <v-data-table
          :headers="headers"
          :items="pagedItems"
          :item-key="'_id'"
          :items-per-page="itemsPerPage"
          :page.sync="page"
          :style="tableVars"
          :height="tableHeight"
          fixed-header
          hide-default-footer
        >
          <template v-slot:[`item.name`]="{ item }">
            {{ formatName(item) }}
          </template>

          <template v-slot:[`item.username`]="{ item }">
            {{ item.username || "-" }}
          </template>

          <template v-slot:[`item.email`]="{ item }">
            {{ item.email || "-" }}
          </template>

          <template v-slot:[`item.birthDate`]="{ item }">
            {{ formatDate(item.birthDate) }}
          </template>

          <template v-slot:[`item.createdAt`]="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              small
              :color="getStatus(item).color"
              :text-color="getStatus(item).text"
              class="status-chip"
            >
              <v-icon v-if="getStatus(item).icon" left size="20">
                {{ getStatus(item).icon }}
              </v-icon>
              {{ getStatus(item).label }}
            </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex align-center">
              <v-btn
                color="#1F2A39"
                text
                class="d-flex align-center action-btn"
                @click="$emit('view', item)"
              >
                <div class="detail-btn mr-2">
                  <v-icon size="20" color="#3B82F6">mdi-eye-outline</v-icon>
                </div>
                <span>รายละเอียด</span>
              </v-btn>

              <!-- ปุ่มระงับ / ยกเลิกระงับบัญชี (เฉพาะ superadmin) -->
              <v-btn
                v-if="isSuperAdmin"
                color="#1F2A39"
                text
                class="d-flex align-center action-btn ml-2"
                @click="$emit('toggle-suspend', item)"
              >
                <div class="detail-btn mr-2">
                  <v-icon
                    size="20"
                    :color="
                      (item.status || '').toLowerCase() === 'suspended'
                        ? '#10B981'
                        : '#EF4444'
                    "
                  >
                    {{
                      (item.status || '').toLowerCase() === 'suspended'
                        ? 'mdi-lock-open-outline'
                        : 'mdi-block-helper'
                    }}
                  </v-icon>
                </div>
                <span>
                  {{
                    (item.status || '').toLowerCase() === 'suspended'
                      ? 'ยกเลิกระงับบัญชี'
                      : 'ระงับบัญชี'
                  }}
                </span>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <v-row class="mt-4" v-if="users.length > 10">
        <v-col
          cols="12"
          md="6"
          class="d-flex align-center justify-center justify-md-start"
        >
          <span class="count-text mr-2">แสดง</span>

          <v-menu v-model="menu" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="custom-select"
                v-bind="attrs"
                v-on="on"
                :class="{ 'menu-open': menu }"
              >
                <span class="items-per-page-text">
                  {{ currentItemsPerPageText }}
                </span>
                <img src="@/assets/caret_down.png" class="caret-icon ml-1" />
              </div>
            </template>

            <v-list>
              <v-list-item
                v-for="option in itemsPerPageOptions"
                :key="option.value"
                @click="selectOption(option)"
              >
                <v-list-item-title>{{ option.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <span class="count-text ml-2">
            จากทั้งหมด {{ users.length }} รายการ
          </span>
        </v-col>

        <v-col
          cols="12"
          md="6"
          class="d-flex align-center justify-center justify-md-end pa-0"
        >
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            prev-icon="ก่อนหน้า"
            next-icon="ถัดไป"
            class="mx-2"
            color="#5C96F8"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Table",

  props: {
    users: { type: Array, required: true },
    userRole: { type: String, default: "" },
  },

  data() {
    return {
      page: 1,
      menu: false,
      itemsPerPage: 10,
      itemsPerPageOptions: [
        { text: "10", value: 10 },
        { text: "100", value: 100 },
        { text: "ทั้งหมด", value: -1 },
      ],
    };
  },

  computed: {
    pageCount() {
      if (this.itemsPerPage === -1) return 1;
      return Math.ceil(this.users.length / this.itemsPerPage);
    },

    pagedItems() {
      if (this.itemsPerPage === -1) return this.users;
      const start = (this.page - 1) * this.itemsPerPage;
      return this.users.slice(start, start + this.itemsPerPage);
    },

    tableHeight() {
      return this.pagedItems.length < 7 ? "auto" : "380px";
    },

    currentItemsPerPageText() {
      const opt = this.itemsPerPageOptions.find(
        (x) => x.value === this.itemsPerPage
      );
      return opt ? opt.text : this.itemsPerPage;
    },

    // เช็ก role superadmin จาก prop
    isSuperAdmin() {
      return (this.userRole || "")
        .toString()
        .trim()
        .toLowerCase() === "superadmin";
    },

    hasVisibleDeleteButton() {
      return this.isSuperAdmin;
    },

    actionsColWidth() {
      return this.hasVisibleDeleteButton ? 192 : 130;
    },

    tableVars() {
      return {
        "--actions-col": `${this.actionsColWidth}px`,
        "--status-right": this.hasVisibleDeleteButton ? "260px" : "148px",
      };
    },

    headers() {
      return [
        {
          text: "ชื่อ-นามสกุล",
          value: "name",
          align: "left",
          class: "header-title",
          cellClass: "cell-normal",
          sortable: false,
          width: "200px",
        },
        {
          text: "ชื่อผู้ใช้",
          value: "username",
          align: "left",
          class: "header-username",
          cellClass: "cell-normal",
          sortable: false,
          width: "180px",
        },
        {
          text: "อีเมล",
          value: "email",
          align: "left",
          class: "header-email",
          cellClass: "cell-normal",
          sortable: false,
          width: "260px",
        },
        {
          text: "วันเกิด",
          value: "birthDate",
          align: "left",
          class: "header-birth",
          cellClass: "cell-normal",
          sortable: false,
          width: "200px",
        },
        {
          text: "วันที่ลงทะเบียน",
          value: "createdAt",
          align: "left",
          class: "header-created",
          cellClass: "cell-normal",
          sortable: false,
          width: "200px",
        },
        {
          text: "สถานะ",
          value: "status",
          align: "left",
          class: "header-status",
          cellClass: "cell-status",
          sortable: false,
          width: "140px",
        },
        {
          text: "จัดการ",
          value: "actions",
          align: "left",
          class: "header-actions",
          cellClass: "cell-actions",
          sortable: false,
          width: `${this.actionsColWidth}px`,
        },
      ];
    },
  },

  watch: {
    page() {
      this.scrollToTopOfTable();
    },
    users() {
      this.page = 1;
      this.scrollToTopOfTable();
    },
  },

  methods: {
    formatName(item) {
      const parts = [
        item.prefix,
        item.firstName,
        item.middleName,
        item.lastName,
      ]
        .map((v) => (v || "").trim())
        .filter(Boolean);

      return parts.length ? parts.join(" ") : "-";
    },

    formatDate(d) {
      if (!d) return "-";

      const date = new Date(d);
      if (isNaN(date.getTime())) return "-";

      const monthsFullThai = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];

      const day = date.getDate();
      const month = monthsFullThai[date.getMonth()];
      const year = date.getFullYear() + 543;

      return `${day} ${month} ${year}`;
    },

    getStatus(user) {
      const status = (user.status || "").toLowerCase();

      if (status === "suspended") {
        return {
          label: "ถูกระงับบัญชี",
          color: "#FDECEC",
          text: "#E11D48",
          icon: "mdi-block-helper",
        };
      }

      if (user.isOnline) {
        return {
          label: "ผู้ใช้ออนไลน์",
          color: "#E1FAE8",
          text: "#0FAE63",
          icon: "mdi-checkbox-blank-circle",
        };
      }

      return {
        label: "ผู้ใช้ออฟไลน์",
        color: "#F3F4F6",
        text: "#6B717F",
        icon: "mdi-checkbox-blank-circle-outline",
      };
    },

    selectOption(option) {
      this.itemsPerPage = option.value;
      this.page = 1;
      this.menu = false;
    },

    scrollToTopOfTable() {
      this.$nextTick(() => {
        const wrapper = this.$el.querySelector(".v-data-table__wrapper");
        if (wrapper) {
          wrapper.scrollTo({ top: 0 });
        } else {
          window.scrollTo({ top: 0 });
        }
      });
    },
  },
};
</script>

<style scoped>
.card-container {
  overflow: hidden !important;
  border-radius: 12px !important;
  box-shadow: 0px 0px 2px 0px #1018280f, 0px 0px 3px 0px #1018281a !important;
}
::v-deep(.cell-normal),
::v-deep(.cell-actions) {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #1f2a39 !important;
}
::v-deep(.header-title),
::v-deep(.header-username),
::v-deep(.header-email),
::v-deep(.header-birth),
::v-deep(.header-status),
::v-deep(.header-created),
::v-deep(.header-actions) {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #6b717f !important;
  background-color: #f9fafc !important;
  box-shadow: none !important;
}
.status-chip {
  border-radius: 8px !important;
}
.count-text {
  font-size: 14px;
  font-weight: 400;
  color: #394253;
}
.items-per-page-text {
  font-size: 14px;
  font-weight: 400;
  color: #394253;
}
.custom-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
}
.caret-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}
.custom-select.menu-open .caret-icon {
  transform: rotate(180deg);
}
::v-deep(.cell-actions) {
  position: sticky;
  right: 0;
  background: #fff;
}
::v-deep(.header-actions) {
  position: sticky;
  right: 0;
  background: #f9fafc;
  box-shadow: none !important;
}
::v-deep(.cell-status) {
  position: sticky;
  right: var(--status-right);
  background: #fff;
  z-index: 1;
  box-shadow: -2px 0 3px -1px #1018280f !important;
}
::v-deep(.header-status) {
  position: sticky;
  right: var(--status-right);
  z-index: 3;
  background: #f9fafc;
  box-shadow: -2px 0 3px -1px #1018280f !important;
}
::v-deep .v-pagination__item,
::v-deep .v-pagination__navigation {
  font-size: 14px !important;
  font-weight: 400 !important;
  border-radius: 8px !important;
  width: 34px !important;
  height: 34px !important;
  box-shadow: 0px 0px 2px 0px #1018280f, 0px 0px 3px 0px #1018281a !important;
}
::v-deep(.v-pagination .v-pagination__navigation .v-icon) {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #6b717f !important;
  font-family: "Noto Sans Thai", sans-serif !important;
  font-style: normal !important;
}
::v-deep(.v-pagination .v-pagination__navigation) {
  width: 65px !important;
  height: 34px !important;
}
.action-btn {
  min-width: 0 !important;
  padding: 0 4px !important;
}
.detail-btn {
  border-radius: 4px !important;
  padding: 2px !important;
  box-shadow: 0px 0px 2px 0px #1018280f, 0px 0px 3px 0px #1018281a !important;
  width: 24px !important;
  height: 24px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>