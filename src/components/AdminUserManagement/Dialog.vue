<template>
  <v-dialog v-model="dialogProxy" max-width="640" persistent>
    <v-card class="dialog-card" elevation="0">
      <v-card-title
        class="dialog-title d-flex justify-space-between align-center"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="#3B82F6">
            mdi-account-circle-outline
          </v-icon>
          <span class="dialog-title-text">รายละเอียดผู้ใช้</span>
        </div>

        <v-btn icon small @click="dialogProxy = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="dialog-body">
        <div v-if="user">
          <v-row>
            <v-col cols="12" md="8">
              <div class="label-text mb-1">ชื่อ-นามสกุล</div>
              <div class="value-text mb-3">{{ fullName }}</div>

              <div class="label-text mb-1">ชื่อผู้ใช้</div>
              <div class="value-text mb-3">{{ user.username || "-" }}</div>

              <div class="label-text mb-1">อีเมล</div>
              <div class="value-text mb-3">{{ user.email || "-" }}</div>
            </v-col>

            <v-col
              cols="12"
              md="4"
              class="d-flex flex-column align-start align-md-end"
            >
              <div class="label-text mb-1">สถานะ</div>
              <v-chip
                small
                :color="statusInfo.color"
                :text-color="statusInfo.text"
                class="status-chip mb-3"
              >
                <v-icon v-if="statusInfo.icon" left size="20">
                  {{ statusInfo.icon }}
                </v-icon>
                {{ statusInfo.label }}
              </v-chip>

              <div class="label-text mb-1">คะแนนสะสม</div>
              <div class="value-text mb-3">
                {{ user.points != null ? user.points.toLocaleString() : "-" }}
              </div>

              <div class="label-text mb-1">ยอดเงินในวอลเล็ต</div>
              <div class="value-text">
                {{
                  user.walletBalance != null
                    ? user.walletBalance.toLocaleString() + " บาท"
                    : "-"
                }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row>
            <v-col cols="12" md="6">
              <div class="label-text mb-1">วันเกิด</div>
              <div class="value-text mb-3">
                {{ formatDate(user.birthDate) }}
              </div>

              <div class="label-text mb-1">วันที่ลงทะเบียน</div>
              <div class="value-text mb-3">
                {{ formatDate(user.createdAt) }}
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="label-text mb-1">เข้าสู่ระบบล่าสุด</div>
              <div class="value-text mb-3">
                {{ formatDateTime(user.lastLoginAt) }}
              </div>

              <div class="label-text mb-1">รหัสแนะนำของผู้ใช้</div>
              <div class="value-text mb-3">
                {{ user.referralCode || "-" }}
              </div>

              <div class="label-text mb-1">จำนวนคนที่แนะนำ</div>
              <div class="value-text">
                {{ user.referralCount != null ? user.referralCount : "-" }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row class="mb-6">
            <v-col cols="12">
              <div class="label-text mb-1">ที่อยู่เริ่มต้นของผู้ใช้</div>
              <div class="value-text">
                {{ defaultAddressText }}
              </div>
            </v-col>
          </v-row>
        </div>

        <div v-else class="text-center py-6">
          <span class="value-text">ไม่พบข้อมูลผู้ใช้</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UserDialog",
  props: {
    value: { type: Boolean, default: false },
    user: { type: Object, default: null },
  },

  computed: {
    dialogProxy: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },

    fullName() {
      if (!this.user) return "-";
      const parts = [
        this.user.prefix,
        this.user.firstName,
        this.user.middleName,
        this.user.lastName,
      ]
        .map((v) => (v || "").trim())
        .filter(Boolean);
      return parts.length ? parts.join(" ") : "-";
    },

    statusInfo() {
      if (!this.user) {
        return {
          label: "-",
          color: "#F3F4F6",
          text: "#6B717F",
          icon: "",
        };
      }

      const status = (this.user.status || "").toLowerCase();

      if (status === "suspended") {
        return {
          label: "ถูกระงับบัญชี",
          color: "#FDECEC",
          text: "#E11D48",
          icon: "mdi-block-helper",
        };
      }

      const lastLogin = this.user.lastLoginAt
        ? new Date(this.user.lastLoginAt)
        : null;
      const ONLINE_MIN = 10;
      const isOnline =
        lastLogin && Date.now() - lastLogin.getTime() <= ONLINE_MIN * 60 * 1000;

      if (isOnline) {
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

    defaultAddressText() {
      const addr = this.user && this.user.defaultAddress;
      if (!addr) return "-";

      const parts = [
        addr.detail,
        addr.subdistrict,
        addr.district,
        addr.province,
        addr.postalCode ? `รหัสไปรษณีย์ ${addr.postalCode}` : "",
      ]
        .map((v) => (v || "").toString().trim())
        .filter(Boolean);

      return parts.length ? parts.join(" ") : "-";
    },
  },

  methods: {
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

    formatDateTime(d) {
      if (!d) return "-";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "-";

      const dateStr = this.formatDate(d);
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      return `${dateStr} เวลา ${hh}:${mm} น.`;
    },
  },
};
</script>

<style scoped>
.dialog-card {
  border-radius: 16px !important;
  box-shadow: none !important;
}
::v-deep(.v-dialog) {
  box-shadow: none !important;
}
.dialog-title {
  padding: 20px 24px 16px !important;
}
.dialog-body {
  padding: 20px 24px 24px !important;
}
.dialog-title-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2a39;
}
.label-text {
  font-size: 14px;
  font-weight: 400;
  color: #6b717f;
}
.value-text {
  font-size: 14px;
  font-weight: 500;
  color: #1f2a39;
  white-space: pre-line;
}
.status-chip {
  border-radius: 8px !important;
}
</style>