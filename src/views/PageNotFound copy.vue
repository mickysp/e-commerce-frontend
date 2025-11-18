<template>
  <v-container
    class="not-found-container d-flex align-center justify-center"
    fluid
  >
    <v-row>
      <v-col cols="12" class="d-flex flex-column align-center">
        <span class="title-text mb-12">404</span>
        <span class="headline-text mb-4">ไม่พบหน้าที่คุณต้องการ</span>
        <span class="subtitle-text mb-6"
          >ขออภัย, ไม่พบหน้าที่คุณกำลังค้นหา</span
        >
        <v-btn
          color="#3D78C8"
          @click="$router.push('/mou_management')"
          dark
          class="btn-go-back"
          >กลับสู่หน้าหลัก</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PageNotFound",
};
</script>

<style scoped>
.not-found-container {
  height: 100vh;
  background: #f5e9e9;
  background-size: cover;
}
.title-text {
  font-size: 96px;
  font-weight: 700;
  color: #a32514;
}
.headline-text {
  font-size: 24px;
  font-weight: 600;
  color: #394253;
}
.subtitle-text {
  font-size: 16px;
  color: #6b717f;
}
.btn-go-back {
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}
</style>
