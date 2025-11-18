<template>
  <div class="coins-form">
    <v-card class="section-card" elevation="0">
      <!-- หัวการ์ด -->
      <div class="card-head">
        <div class="head-gradient head-gradient--green" />
        <div class="head-inner head-flex">
          <h2 class="form-title">Coins ของฉัน</h2>

          <!-- ปุ่มเติมเงิน -->
          <v-btn class="btn-topup" height="40" @click="openTopup">
            เติมเงิน
          </v-btn>
        </div>
      </div>

      <v-divider class="mb-4" />

      <div class="section-form pt-0">
        <!-- ยอดคงเหลือ -->
        <div class="balance-row">
          <div class="coin-badge">
            <v-icon size="30" color="#f59e0b">mdi-currency-usd</v-icon>
          </div>
          <div class="balance-main">
            <div class="balance-amt">{{ formatAmount(balance) }}</div>
            <div class="balance-text">EL-SON Coins ที่ใช้ได้</div>
            <div class="balance-exp">
              {{ formatAmount(balance) }} จะหมดอายุใน {{ expireText }}
            </div>
          </div>
        </div>

        <v-divider class="my-6" />

        <!-- ประวัติการใช้ Coins -->
        <div class="hist-head">ประวัติการใช้ Coins</div>

        <div class="hist-list">
          <div v-for="it in items" :key="it.id" class="hist-item">
            <div class="hist-left">
              <div class="coin-badge sm">
                <v-icon size="24" color="#f59e0b">mdi-currency-usd</v-icon>
              </div>
              <div class="hist-texts">
                <div class="hist-title">{{ it.title }}</div>
                <div class="hist-sub">{{ it.sub }}</div>
                <div class="hist-date">{{ formatDate(it.at) }}</div>
              </div>
            </div>

            <div class="hist-amt" :class="it.amount >= 0 ? 'pos' : 'neg'">
              {{ it.amount >= 0 ? "+" : "" }}{{ formatAmount(it.amount) }}
            </div>
          </div>

          <div v-if="items.length === 0" class="empty-wrap">
            <div class="empty-card">
              <v-icon size="40" color="#9ca3af" class="mb-2"
                >mdi-history</v-icon
              >
              <div class="empty-title">ยังไม่มีประวัติการรับ/ใช้ Coins</div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Dialog เติมเงิน -->
    <v-dialog v-model="topupOpen" max-width="520">
      <v-card class="topup-card" elevation="0">
        <div class="topup-head">
          <h3>เติมเงินเข้า Coins</h3>
          <p class="muted">1 บาท = 1 Coins</p>
        </div>

        <v-divider class="mb-4" />

        <div class="topup-body">
          <span class="detail-text">จำนวนเงิน (บาท)</span>
          <v-text-field
            v-model.number="topupAmount"
            type="number"
            min="0"
            step="1"
            placeholder="เช่น 100"
            v-bind="tfProps"
            :rules="[req, min10]"
            @wheel.stop
          />

          <div class="quick-row">
            <v-chip
              v-for="n in quickAmounts"
              :key="n"
              class="quick-chip"
              @click="setQuick(n)"
              label
            >
              {{ n.toLocaleString("th-TH") }}
            </v-chip>
          </div>

          <div class="preview-row" v-if="Number(topupAmount) > 0">
            จะได้รับ <b>{{ formatAmount(topupAmount) }}</b> Coins
          </div>
        </div>

        <div class="topup-actions">
          <v-btn class="btn-outline" height="40" @click="topupOpen = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            class="btn-success"
            height="40"
            :disabled="!canTopup || topupLoading"
            :loading="topupLoading"
            @click="confirmTopup"
          >
            ยืนยันเติมเงิน
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import swalAlert from "@/services/alert/swalServices";

export default {
  name: "MyCoins",
  data() {
    return {
      balance: 3.4,
      expireText: "26-07-2565",
      items: [
        {
          id: 1,
          title: "รับ Coins จากการแชร์",
          sub: "ได้รับ Coins จากการแนะนำเพื่อน",
          at: "2025-06-25T14:44:00+07:00",
          amount: 0.5,
        },
        {
          id: 2,
          title: "เช็คอิน",
          sub: "ได้รับ Coins จากการแนะนำเพื่อน",
          at: "2025-06-25T14:44:00+07:00",
          amount: 1,
        },
        {
          id: 3,
          title: "รับ Coins จากการแนะนำเพื่อน",
          sub: "ได้รับ Coins จากการทำกิจกรรม EL-SON POP",
          at: "2025-06-25T14:44:00+07:00",
          amount: 0.4,
        },
      ],

      // topup dialog
      topupOpen: false,
      topupAmount: null,
      topupLoading: false,
      quickAmounts: [50, 100, 200, 500, 1000],

      tfProps: { outlined: true, hideDetails: "auto", dense: true },
      req: (v) => !!v || "กรุณากรอกจำนวนเงิน",
      min10: (v) => Number(v) >= 10 || "ขั้นต่ำ 10 บาท",
    };
  },
  computed: {
    canTopup() {
      return Number(this.topupAmount) >= 10;
    },
  },
  methods: {
    formatAmount(n) {
      const num = Number(n || 0);
      return num.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    formatDate(iso) {
      const d = new Date(iso);
      const dd = d.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const tt = d.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${dd} ${tt}`;
    },

    // topup
    openTopup() {
      this.topupAmount = null;
      this.topupOpen = true;
    },
    setQuick(n) {
      this.topupAmount = n;
    },
    async confirmTopup() {
      if (!this.canTopup) return;

      this.topupLoading = true;
      try {

        const credited = Number(this.topupAmount); 

        this.balance = Number(this.balance) + credited;
        this.items.unshift({
          id: Date.now(),
          title: "เติมเงินเข้า Coins",
          sub: "เติมเงินสำเร็จ",
          at: new Date().toISOString(),
          amount: credited,
        });

        this.$emit("topup", { amount: credited });

        this.topupOpen = false;
        await swalAlert.Success("เติมเงินสำเร็จ");
      } catch (e) {
        await swalAlert.Error(
          "ไม่สามารถเติมเงินได้",
          e?.response?.data?.message || ""
        );
      } finally {
        this.topupLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.section-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
}
.card-head {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
}
.head-gradient {
  height: 76px;
  opacity: 0.18;
}
.head-gradient--green {
  background: linear-gradient(100deg, #d6230b 0%, #eed7d5 100%);
}
.head-inner {
  padding: 30px 24px 14px;
}
.head-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.form-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.section-form {
  padding: 22px 24px 28px;
}

/* ปุ่มบนหัวการ์ด */
.btn-topup {
  background: #cf2e18 !important; /* เขียว */
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 120px;
}

/* Balance */
.balance-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}
.coin-badge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff7ed;
  border: 2px solid #fcd34d;
  display: grid;
  place-items: center;
}
.coin-badge.sm {
  width: 44px;
  height: 44px;
  border-width: 2px;
}
.balance-main {
  display: grid;
  gap: 2px;
}
.balance-amt {
  font-size: 32px;
  font-weight: 800;
  color: #f59e0b;
  line-height: 1;
}
.balance-text {
  font-weight: 700;
  color: #1f2a39;
}
.balance-exp {
  color: #9ca3af;
  font-size: 13px;
}

/* History */
.hist-head {
  font-weight: 800;
  color: #111827;
  margin: 14px 0 10px;
}
.hist-list {
  display: grid;
  gap: 12px;
}
.hist-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
  padding: 14px 16px;
}
.hist-left {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.hist-texts {
  display: grid;
  gap: 2px;
}
.hist-title {
  font-weight: 700;
  color: #111827;
}
.hist-sub {
  color: #6b7280;
  font-size: 13px;
}
.hist-date {
  color: #9ca3af;
  font-size: 12px;
  margin-top: 2px;
}
.hist-amt {
  font-weight: 800;
  align-self: center;
  min-width: 80px;
  text-align: right;
}
.hist-amt.pos {
  color: #f59e0b;
}
.hist-amt.neg {
  color: #ef4444;
}
.topup-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
}
.topup-head {
  padding: 18px 20px 0;
}
.topup-head h3 {
  margin: 0 0 4px;
  font-weight: 700;
  color: #111827;
  font-size: 18px;
}
.topup-head .muted {
  color: #80796b;
  margin: 0 0 8px;
}
.topup-body {
  padding: 0 20px 10px;
}
.detail-text {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1f2a39;
  margin-bottom: 4px;
}
.quick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}
:deep(.quick-chip) {
  background: #ffecb3 !important;
  border: 1px solid #fcd34d !important;
  font-weight: 700;
  color: #111827 !important;
}
:deep(.quick-row .quick-chip:nth-child(4)),
:deep(.quick-row .quick-chip:nth-child(5)) {
  background: #eef2ff !important;
  border-color: #6366f1 !important;
  color: #3730a3 !important;
}
:deep(.quick-row .quick-chip:nth-child(4) .v-chip__content),
:deep(.quick-row .quick-chip:nth-child(5) .v-chip__content) {
  color: #3730a3 !important;
}
.preview-row {
  margin-top: 10px;
  color: #1f2a39;
}
.topup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 20px 18px;
}
.btn-success {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 150px;
}
.btn-outline {
  background: #ffffff !important;
  color: #1f2937 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 10px !important;
}

:deep(.v-input--dense .v-input__slot) {
  min-height: 45px !important;
  height: 45px !important;
  padding: 0 10px !important;
  border-radius: 10px !important;
  border-color: #e5e7eb !important;
}
:deep(.v-text-field.v-input--dense input) {
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
  font-size: 14px !important;
}

@media (max-width: 600px) {
  .hist-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .hist-amt {
    justify-self: end;
  }
}
</style>
