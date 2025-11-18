import router from "@/router";
import swalAlert from "@/services/alert/swalServices";
import store from "@/store";

const forceLogout = async (message) => {
  if (message && router.currentRoute && router.currentRoute.name !== "login") {
    await swalAlert.Error(message, "กำลังนำคุณไปที่หน้าเข้าสู่ระบบ ...");
  }

  await store.dispatch("forceLogout");

  try {
    localStorage.clear();
  } catch (e) {
    // ignore
  }

  if (router.currentRoute && router.currentRoute.name !== "login") {
    router.push({ name: "login" });
  }
};

export const initLocalStorageWatcher = () => {
  window.addEventListener("storage", (event) => {
    if (event.key === "vuex") {
      forceLogout("ข้อมูลถูกเปลี่ยนแปลง");
    }
  });
};
