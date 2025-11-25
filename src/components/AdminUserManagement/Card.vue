<template>
  <div class="cards-grid-container">
    <v-card
      v-for="(card, i) in cardsWithValue"
      :key="'user-card-' + i"
      class="card-data"
      :class="{ 'card-data-active': isActive(card) }"
      @mousedown="$emit('select-card', i)"
      :elevation="0"
      :ripple="false"
      style="cursor: pointer"
      :style="getCardStyle(card)"
    >
      <v-card-text>
        <div class="card-content">
          <div class="card-icon">
            <v-icon :color="card.color" size="40">
              {{ card.icon }}
            </v-icon>
          </div>
          <div class="d-flex flex-column">
            <span class="card-title">{{ card.title }}</span>
            <span class="card-value" :style="{ color: card.color }">
              {{ card.value }}
            </span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    usersData: {
      type: Array,
      required: true,
    },
    selectedCardIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      baseCards: [
        {
          key: "all",
          title: "ผู้ใช้ทั้งหมด",
          icon: "mdi-folder-outline",
          color: "#2563EB",
        },
        {
          key: "active",
          title: "กำลังใช้งาน",
          icon: "mdi-account-check-outline",
          color: "#3B82F6",
        },
        {
          key: "new_7d",
          title: "ช่วง 7 วันที่ผ่านมา",
          icon: "mdi-text-box-plus-outline",
          color: "#F97316",
        },
        {
          key: "inactive",
          title: "ไม่ได้ใช้งาน / ถูกระงับ",
          icon: "mdi-account-off-outline",
          color: "#10B981",
        },
      ],
    };
  },

  computed: {
    selectedCard() {
      return this.baseCards[this.selectedCardIndex] || this.baseCards[0];
    },

    cardsWithValue() {
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

      return this.baseCards.map((card, index) => {
        let value = 0;

        if (card.key === "all") {
          value = this.usersData.length;
        } else if (card.key === "active") {
          value = this.usersData.filter(
            (u) => normalizeStatus(u.status) === "active"
          ).length;
        } else if (card.key === "new_7d") {
          value = this.usersData.filter((u) => {
            if (!u.createdAt) return false;
            const ts = new Date(u.createdAt).getTime();
            return ts >= sevenDaysAgo;
          }).length;
        } else if (card.key === "inactive") {
          value = this.usersData.filter((u) => {
            const s = normalizeStatus(u.status);
            return s === "inactive" || s === "suspended";
          }).length;
        }

        return {
          ...card,
          value,
          index,
        };
      });
    },
  },

  methods: {
    isActive(card) {
      return card.index === this.selectedCardIndex;
    },

    getCardStyle(card) {
      if (!this.isActive(card)) return {};

      if (card.key === "all" || card.key === "active") {
        return { background: "#E6F1FF", border: "1px solid #3D78C8" };
      }
      if (card.key === "new_7d") {
        return { background: "#FFF7EB", border: "1px solid #FFB121" };
      }
      if (card.key === "inactive") {
        return { background: "#E6FFF2", border: "1px solid #10B85D" };
      }
      return {};
    },
  },
};
</script>

<style scoped>
.card-data {
  border-radius: 16px;
  border: 1px solid #f3f5f7;
  background: #ffffff;
  min-height: 120px;
    display: flex;
  align-items: center;
}
.card-data:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-in-out;
  z-index: 10;
}
.card-data:hover:not(.card-data-active) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}
.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-icon {
  flex-shrink: 0;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-value {
  font-size: 24px;
  font-weight: 700;
  padding: 4px 0;
  white-space: nowrap;
}
.cards-grid-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 1439px) {
  .cards-grid-container {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 1023px) {
  .cards-grid-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 860px) {
  .cards-grid-container {
    grid-template-columns: 1fr;
  }
}
</style>
