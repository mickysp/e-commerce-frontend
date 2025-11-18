<template>
  <v-container fluid class="pa-0">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

  </v-container>
</template>

<script>


export default {
  name: "Home",

  data() {
    return {
      isLoading: false,
    };
  },
};
</script>

<style scoped>
.v-container {
  padding: 0 !important;
}
</style>
