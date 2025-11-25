<template>
  <div class="board-new">
    <div class="board-new__container">
      <div class="board-new__header">
        <h2 class="board-new__title">กระดานข่าวใหม่</h2>
        <button class="board-new__more-btn" @click="goMore">
          ดูเพิ่มเติม
        </button>
      </div>

      <div v-if="isLoading" class="board-new__loading">
        <v-progress-circular indeterminate :size="32" :width="3" />
      </div>

      <div v-else-if="items.length === 0" class="board-new__empty">
        ยังไม่พบข่าวใหม่
      </div>

      <div v-else class="board-new__list">
        <div
          v-for="item in items"
          :key="item._id"
          class="board-new__card"
          @click="goDetail(item._id)"
        >
          <div class="board-new__image-wrapper">
            <img
              :src="toImageUrl(item.image)"
              alt=""
              class="board-new__image"
            />
          </div>

          <div class="board-new__body">
            <h3 class="board-new__card-title">
              {{ item.title }}
            </h3>
            <p class="board-new__meta">
              เผยแพร่ เมื่อ {{ formatTimeAgo(item.publishedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchLatestBoards } from "@/services/api/boardServices";

export default {
  name: "BoardNew",

  data() {
    return {
      items: [],
      isLoading: false,
    };
  },

  async created() {
    this.isLoading = true;
    try {
      const res = await fetchLatestBoards(5);
      this.items = res.data || [];
    } catch (e) {
      console.error("fetchLatestBoards error:", e);
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    toImageUrl(path) {
      const base = process.env.VUE_APP_API_URL || "";
      if (!path) return "https://via.placeholder.com/400x500?text=No+Image";
      return `${base}${path}`;
    },

    formatTimeAgo(dateStr) {
      if (!dateStr) return "";
      const published = new Date(dateStr);
      const now = new Date();
      const diffMs = now - published;
      if (diffMs <= 0) return "วันนี้";

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 1) return "ภายในวันนี้";

      const weeks = Math.floor(diffDays / 7);
      if (weeks >= 1) return `${weeks} สัปดาห์ที่แล้ว`;

      return `${diffDays} วันที่แล้ว`;
    },

    goMore() {
      this.$router.push({ name: "Board" });
    },

    goDetail(id) {
      this.$router.push({ name: "BoardDetail", params: { boardId: id } });
    },
  },
};
</script>

<style scoped>
.board-new {
  width: 100%;
  padding: 90px 0;
}
.board-new__container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  box-sizing: border-box;
}
@media (min-width: 1440px) and (max-width: 1919px) {
  .board-new__container {
    max-width: 1200px;
  }
}
.board-new__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.board-new__title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}
.board-new__more-btn {
  padding: 8px 20px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: #000;
  color: #fff;
}
.board-new__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}
.board-new__card {
  cursor: pointer;
}
.board-new__image-wrapper {
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #f3f3f3;
}
.board-new__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.board-new__body {
  margin-top: 12px;
}
.board-new__card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
}
.board-new__meta {
  font-size: 12px;
  color: #777;
  margin: 0;
}
.board-new__empty {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #777;
  text-align: center;
}
@media (max-width: 1200px) {
  .board-new__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .board-new__container {
    max-width: 100%;
  }

  .board-new__list {
    grid-template-columns: 1fr;
  }
}
</style>
