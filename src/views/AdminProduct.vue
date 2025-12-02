<template>
  <v-container fluid class="pa-5">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <template v-if="!isLoading">
      <v-card class="card-container d-flex pa-6" elevation="0">
        <v-row>
          <v-col cols="12">
            <span class="title-text">จัดการสินค้า</span>
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
              <span class="no-data-text mb-4"> ยังไม่มีรายการสินค้า </span>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-container>
</template>

<script>
export default {
  name: "AdminProduct",
  components: {},

  data() {
    return {
      isLoading: false,
    };
  },

  created() {
    this.loadProfile();
  },
};
</script>

<style scoped>
.title-text {
  font-size: 24px;
  font-weight: 700;
  color: #1f2a39;
}
.no-data-text {
  font-size: 14px;
  font-weight: 400;
  color: #6b717f;
}
.card-container {
  border-radius: 16px !important;
  box-shadow: 0 0 2px 0 #1018280d !important;
}
</style>