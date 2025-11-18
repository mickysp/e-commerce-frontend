<template>
  <div class="delete-continue">
    <v-card class="section-card" elevation="0">
      <div class="card-head">
        <div class="head-gradient head-gradient--green" />
        <div class="head-inner">
          <h2 class="form-title">การตั้งค่าความเป็นส่วนตัว</h2>
          <p class="subtitle">
            เมื่อคุณลบบัญชี
            ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้
          </p>
        </div>
      </div>

      <v-divider class="mb-4" />

      <div class="section-form pt-0">
        <p class="lead">
          โดยการคลิก
          <strong>“ดำเนินการต่อ”</strong> คุณได้ยอมรับเงื่อนไขต่อไปนี้:
        </p>

        <ul class="bullet-list">
          <li>
            บัญชีที่ถูกลบจะไม่สามารถกู้คืนได้
            และคุณจะไม่สามารถเข้าสู่ระบบหรือเข้าถึงข้อมูลเดิมได้อีกหลังจากลบสำเร็จ
          </li>
          <li>Coins คงเหลือทั้งหมดในบัญชีของคุณจะถูกลบ</li>
          <li>
            คุณจะไม่สามารถคืนสินค้าหรือผู้ใช้ได้หากมีการสั่งซื้อ ยอดเงิน
            หรือการดำเนินการทางกฎหมายค้างอยู่ในระบบ
          </li>
          <li>
            EL-SON
            อาจเก็บ/ลบข้อมูลส่วนตัวไว้ตามข้อกำหนดทางกฎหมายหรือนโยบายเพื่อป้องกันการฉ้อโกง
          </li>
          <li>
            หากคุณต้องการกลับมาใช้งานอีกครั้ง
            จะต้องลงทะเบียนใหม่ด้วยอีเมลหรือเบอร์โทรศัพท์ที่ไม่เคยใช้มาก่อน
          </li>
          <li>
            การลบบัญชีจะยกเลิกสิทธิ์การใช้บริการทั้งหมด
            รวมถึงสิทธิพิเศษหรือโปรโมชั่นที่เคยได้รับ
          </li>
        </ul>

        <div class="actions mt-6">
          <v-btn class="btn-success" height="44" @click="onContinue">
            ดำเนินการต่อ
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import swalAlert from "@/services/alert/swalServices";
import send from "@/assets/alert/send.png";

export default {
  name: "DeleteProfileContinue",
  methods: {
    async onContinue() {
      const res = await swalAlert.Dialog(
        "ยืนยันการลบบัญชี",
        "คุณต้องการที่จะลบบัญชีผู้ใช้หรือไม่?<br/>การลบจะเป็นแบบถาวรและไม่สามารถกู้คืนได้",
        send,
        132,
        121,
        "ยืนยัน",
        "ยกเลิก",
        true
      );
      if (res.isConfirmed) {
        this.$emit("continue");
      }
    },
  },
};
</script>

<style scoped>
.section-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
}
.card-head {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
}
.head-gradient {
  height: 76px;
  opacity: 0.18;
}
.head-gradient--green {
  background: linear-gradient(100deg, #d6230b 0%, #eed7d5 100%);
}
.head-inner {
  padding: 30px 34px 14px;
}
.form-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  font-family: "Noto Sans Thai", system-ui, Arial, sans-serif;
}
.subtitle {
  color: #6b7280;
  margin-bottom: 8px;
}
.section-form {
  padding: 34px;
}
.lead {
  color: #1f2a39;
  margin-bottom: 10px;
  font-size: 15px;
}
.bullet-list {
  margin: 6px 0 0;
  padding-left: 18px;
  color: #374151;
  line-height: 1.75;
}
.bullet-list li {
  margin: 6px 0;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn-success {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 180px;
}
.btn-success:hover {
  filter: brightness(0.96);
}
@media (max-width: 600px) {
  .section-form {
    padding: 22px;
  }
}
</style>
