<template>
  <v-container fluid class="pa-0">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <Banner />
    <DeliveryDetail />
    <Card />
    <RewardCard />
    <DeliveryDownload />
  </v-container>
</template>

<script>
import Banner from "@/components/Delivery/Banner.vue";
import DeliveryDetail from "@/components/Delivery/DeliveryDetail.vue";
import Card from "@/components/Delivery/Card.vue";
import RewardCard from "@/components/Delivery/RewardCard.vue";
import DeliveryDownload from "@/components/Delivery/DeliveryDownload.vue";

export default {
  name: "Delivery",
    components: { Banner, DeliveryDetail, Card, RewardCard, DeliveryDownload },


  data() {
    return {
      isLoading: false,
    };
  },
};
</script>

<style scoped>
</style>