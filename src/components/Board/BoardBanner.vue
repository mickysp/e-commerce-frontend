<template>
  <div class="board-banner d-flex align-center justify-center">
    <span class="board-banner__title">กระดานข่าว</span>
  </div>
</template>

<script>
export default {
  name: "BoardBanner",
};
</script>

<style scoped>
.board-banner {
  width: 100%;
  height: 263px;
  background: linear-gradient(90deg, #f55555 0%, #fff5f5 100%);
  display: flex;
}

.board-banner__title {
  font-size: 40px;
  font-weight: 700;
  color: #000000;
}
</style>