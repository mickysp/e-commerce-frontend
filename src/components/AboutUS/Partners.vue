<template>
  <div class="partners">
    <section class="partners-section">
      <v-container class="px-0">
        <h2 class="partners-title">OUR PARTNERS</h2>

        <v-row class="tiles" no-gutters align="center" justify="space-between">
          <v-col
            v-for="(p, i) in partners"
            :key="i"
            cols="auto"
            class="py-6 d-flex justify-center"
          >
            <div class="partner-tile">
              <v-icon size="40" color="#c53320">mdi-account-group</v-icon>
              <div class="caption">พันธมิตร</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "Partners",
  data() {
    return {
      partners: Array.from({ length: 5 }),
    };
  },
};
</script>

<style scoped>
.partners {
  padding-bottom: 90px;
}
.partners-section {
  background: linear-gradient(180deg, #fdf8f6 0%, #f7ebe7 50%, #eaccc3 100%);
  border-radius: 8px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px 40px;
  box-sizing: border-box;
}
.partners-title {
  color: #1f2734;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin: 0 0 10px 0;
}
.partner-tile {
  width: 140px;
  height: 140px;
  background: #f3f4f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.partner-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}
.caption {
  margin-top: 6px;
  font-size: 12px;
  color: #111827;
  font-family: "Noto Sans Thai", Arial, sans-serif !important;
}
.tiles {
  margin-top: 6px;
}

@media (max-width: 768px) {
  .partners-section {
    padding: 18px 16px 22px;
    border-radius: 6px;
  }
  .partner-tile {
    width: 100px;
    height: 100px;
    border-radius: 14px;
  }
}
</style>
