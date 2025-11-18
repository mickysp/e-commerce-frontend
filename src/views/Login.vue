<template>
  <v-container fluid class="pa-0 login-container">
    <v-overlay :value="isLoading" absolute>
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular indeterminate size="64" :width="5" />
        <span class="my-4">กำลังโหลดข้อมูล</span>
      </div>
    </v-overlay>

    <LoginUser
      v-if="$route.name === 'login'"
      @loading="isLoading = $event"
    />
    <LoginSeller
      v-else-if="$route.name === 'login_seller'"
      @loading="isLoading = $event"
    />
  </v-container>
</template>

<script>
import LoginUser from "@/components/Login/LoginUser.vue";
import LoginSeller from "@/components/Login/LoginSeller.vue";

export default {
  name: "Login",
  components: { LoginUser, LoginSeller },
  data: () => ({ isLoading: false }),
};
</script>


<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
