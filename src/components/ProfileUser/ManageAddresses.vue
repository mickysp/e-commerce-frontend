<template>
  <div class="addresses-form">
    <v-card class="section-card" elevation="0">
      <div class="card-head">
        <div class="head-gradient head-gradient--green" />
        <div class="head-inner d-flex align-center justify-space-between">
          <div>
            <h2 class="form-title">ที่อยู่</h2>
            <p class="subtitle">จัดการข้อมูลที่อยู่ของคุณ</p>
          </div>

          <v-btn v-if="!showForm" class="btn-add" height="40" @click="onCreate">
            เพิ่มที่อยู่
          </v-btn>
        </div>
      </div>

      <v-divider class="mb-4" />

      <div class="section-form pt-0">
        <FormAddress
          v-if="showForm"
          :mode="formMode"
          :value="selectedAddressForForm"
          @save="handleFormSave"
          @cancel="handleFormCancel"
        />

        <template v-else>
          <div v-if="loading" class="py-8 d-flex justify-center">
            <v-progress-circular
              indeterminate
              size="32"
              width="3"
              color="#16a34a"
            />
          </div>

          <div v-else-if="items.length === 0" class="empty-wrap">
            <div class="empty-card">
              <v-icon size="40" color="#9ca3af" class="mb-2"
                >mdi-map-marker-outline</v-icon
              >
              <div class="empty-title">ยังไม่มีที่อยู่</div>
              <div class="empty-sub">
                เพิ่มที่อยู่แรกของคุณเพื่อใช้ในการสั่งซื้อ
              </div>
            </div>
          </div>

          <div v-else class="list-wrap">
            <div v-for="ad in pagedItems" :key="ad._id" class="addr-card">
              <div class="addr-main">
                <div class="addr-name">{{ displayName(ad) }}</div>
                <div class="addr-phone">เบอร์โทร: {{ ad.phone || "-" }}</div>
                <div class="addr-detail">
                  {{ buildFullAddress(ad) }}
                </div>

                <div class="addr-actions">
                  <span class="link-text" @click="onEdit(ad)">แก้ไข</span>
                  <span class="divider">|</span>
                  <span class="link-text danger" @click="onDelete(ad)">ลบ</span>
                </div>
              </div>

              <div class="addr-side">
                <v-chip
                  class="type-chip"
                  :class="ad.addressType === 'บ้าน' ? 'home' : 'work'"
                  small
                  label
                >
                  {{ ad.addressType || "บ้าน" }}
                </v-chip>

                <v-btn
                  v-if="defaultAddress !== ad._id"
                  class="btn-set-default"
                  text
                  small
                  @click="setDefault(ad)"
                  >ตั้งเป็นค่าเริ่มต้น</v-btn
                >

                <v-chip v-else class="default-chip" small label
                  >ค่าเริ่มต้น</v-chip
                >
              </div>
            </div>
          </div>

          <div
            class="pagination-row mt-4"
            v-if="sortedItems.length > itemsPerPage"
          >
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              prev-icon="ก่อนหน้า"
              next-icon="ถัดไป"
              class="mx-2"
              color="#5C96F8"
            />
          </div>
        </template>
      </div>
    </v-card>
  </div>
</template>

<script>
import swalAlert from "@/services/alert/swalServices";
import {
  getMyAddresses,
  deleteAddress,
  setDefaultAddress,
  createAddress,
  updateAddress,
} from "@/services/api/userServices";

import FormAddress from "@/components/ProfileUser/FormAddress.vue";

export default {
  name: "ManageAddresses",
  components: { FormAddress },
  data() {
    return {
      loading: false,
      items: [],
      defaultAddress: null,
      showForm: false,
      formMode: "create",
      selectedAddress: null,
      page: 1,
      itemsPerPage: 5,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.sortedItems.length / this.itemsPerPage);
    },

    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.sortedItems.slice(start, start + this.itemsPerPage);
    },

    selectedAddressForForm() {
      if (!this.selectedAddress) return null;
      const ad = this.selectedAddress;

      return {
        _id: ad._id,
        prefix: ad.prefix || "",
        fullName:
          ad.fullName || [ad.firstName, ad.lastName].filter(Boolean).join(" "),
        phone: ad.phone || "",
        province: ad.province || "",
        district: ad.district || "",
        subDistrict: ad.subdistrict || "",
        postalCode: ad.postalCode || "",
        addressDetail: ad.detail || "",
        defaultType:
          ad.defaultType ||
          (ad.addressType === "ที่ทำงาน"
            ? "work"
            : ad.addressType === "บ้าน"
            ? "home"
            : null),
      };
    },

    sortedItems() {
      const list = [...this.items];

      return list.sort((a, b) => {
        const aIsDefault = a._id === this.defaultAddress;
        const bIsDefault = b._id === this.defaultAddress;

        if (aIsDefault && !bIsDefault) return -1;
        if (!aIsDefault && bIsDefault) return 1;

        const aTime = a.createdAt || a.updatedAt || 0;
        const bTime = b.createdAt || b.updatedAt || 0;

        if (aTime && bTime) {
          return new Date(bTime) - new Date(aTime);
        }
        return 0;
      });
    },

    pageCount() {
      if (this.sortedItems.length === 0) return 1;
      return Math.ceil(this.sortedItems.length / this.itemsPerPage);
    },

    pagedItems() {
      const start = (this.page - 1) * this.itemsPerPage;
      return this.sortedItems.slice(start, start + this.itemsPerPage);
    },
  },

  watch: {
    page() {
      this.$nextTick(() => {
        const firstCard = this.$el.querySelector(".addr-card");

        if (firstCard) {
          const top =
            firstCard.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({
            top,
            behavior: "smooth",
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    },
  },

  activated() {
    this.showForm = false;
    this.selectedAddress = null;
    this.formMode = "create";
  },

  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const data = await getMyAddresses();
        this.items = Array.isArray(data?.items) ? data.items : [];
        this.defaultAddress = data?.defaultAddress || null;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    displayName(ad) {
      const pre = ad.prefix || "";
      const name = [ad.firstName, ad.lastName].filter(Boolean).join(" ");
      return [pre, name].filter(Boolean).join(" ").trim();
    },
    buildFullAddress(ad) {
      const parts = [
        ad.detail,
        ad.subdistrict ? `ตำบล${ad.subdistrict}` : "",
        ad.district ? `อำเภอ${ad.district}` : "",
        ad.province ? `จังหวัด${ad.province}` : "",
        ad.postalCode,
      ].filter(Boolean);
      return parts.join(", ");
    },

    onCreate() {
      this.formMode = "create";
      this.selectedAddress = null;
      this.showForm = true;
    },
    onEdit(ad) {
      this.formMode = "edit";
      this.selectedAddress = ad;
      this.showForm = true;
    },

    splitFullName(fullName = "") {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length === 0) {
        return { firstName: "", lastName: "" };
      }
      if (parts.length === 1) {
        return { firstName: parts[0], lastName: "" };
      }
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");
      return { firstName, lastName };
    },

    async handleFormSave({ mode, data }) {
      try {
        this.loading = true;

        const { firstName, lastName } = this.splitFullName(data.fullName);

        const payload = {
          prefix: data.prefix || "",
          firstName,
          lastName,
          phone: data.phone,
          province: data.province,
          district: data.district,
          subdistrict: data.subDistrict,
          postalCode: data.postalCode,
          detail: data.addressDetail,
          addressType:
            data.defaultType === "work"
              ? "ที่ทำงาน"
              : data.defaultType === "home"
              ? "บ้าน"
              : undefined,
        };

        if (!payload.addressType) {
          delete payload.addressType;
        }

        if (mode === "create") {
          await createAddress(payload);
        } else {
          await updateAddress(data._id, payload);
        }

        await this.fetchData();
        this.showForm = false;
        this.selectedAddress = null;
        this.formMode = "create";

        swalAlert.Success("บันทึกที่อยู่สำเร็จ");
      } catch (e) {
        console.error(e);
        swalAlert.Error("บันทึกที่อยู่ไม่สำเร็จ");
      } finally {
        this.loading = false;
      }
    },

    handleFormCancel() {
      this.showForm = false;
      this.selectedAddress = null;
      this.formMode = "create";
    },

    async onDelete(ad) {
      const res = await swalAlert.Dialog(
        "ยืนยันการลบที่อยู่",
        "คุณต้องการลบที่อยู่นี้หรือไม่?",
        require("@/assets/cancel.png"),
        80,
        80,
        "ลบ",
        "ยกเลิก",
        true
      );
      if (!res.isConfirmed) return;

      try {
        this.loading = true;
        await deleteAddress(ad._id);
        await this.fetchData();
      } catch (e) {
        console.error(e);
        swalAlert.Error("ลบที่อยู่ไม่สำเร็จ");
      } finally {
        this.loading = false;
      }
    },

    async setDefault(ad) {
      try {
        this.loading = true;
        await setDefaultAddress(ad._id);
        await this.fetchData();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchData();
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
  padding: 22px 24px 16px;
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
  padding: 22px 24px 28px;
}
.btn-add {
  background: #cf2e18 !important;
  color: #fff !important;
  border-radius: 10px !important;
  min-width: 140px;
}
.list-wrap {
  display: grid;
  gap: 16px;
  font-size: 14px;
}
.addr-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
  padding: 18px 20px;
}
.addr-name {
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
  font-size: 16px;
}
.addr-phone,
.addr-detail {
  color: #4b5563;
}
.addr-detail {
  margin-top: 4px;
  line-height: 1.6;
}
.addr-actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.link-text {
  font-size: 14px;
  color: #3b82f6;
  cursor: pointer;
}
.link-text:hover {
  color: #2563eb;
  text-decoration: underline;
}
.link-text.danger {
  color: #ef4444;
}
.link-text.danger:hover {
  color: #dc2626;
}
.divider {
  color: #9ca3af;
}
.addr-side {
  display: grid;
  align-content: start;
  justify-items: end;
  gap: 8px;
}
.type-chip {
  font-weight: 700;
  color: #111827;
}
.type-chip.home {
  background: #fde68a;
}
.type-chip.work {
  background: #bae6fd;
}
.btn-set-default {
  text-transform: none !important;
  color: #3b82f6 !important;
  font-weight: 600 !important;
  padding: 0 !important;
  letter-spacing: 0;
}
.default-chip {
  background: #97f5b8;
  color: #209e50;
  font-weight: 600;
}

.empty-wrap {
  display: grid;
  place-items: center;
  padding: 36px 0;
}
.empty-card {
  text-align: center;
  color: #6b7280;
}
.empty-title {
  font-weight: 700;
  color: #111827;
}
.empty-sub {
  margin-top: 2px;
}
.pagination-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
::v-deep .v-pagination__item,
::v-deep .v-pagination__navigation {
  font-size: 14px !important;
  font-weight: 400 !important;
  border-radius: 8px !important;
  width: 38px !important;
  height: 38px !important;
  box-shadow: 0px 0px 2px 0px #1018280f, 0px 0px 3px 0px #1018281a !important;
}
::v-deep(.v-pagination .v-pagination__navigation) {
  width: 65px !important;
  height: 34px !important;
}
::v-deep(.v-pagination .v-pagination__navigation .v-icon) {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #6b717f !important;
  font-family: "Noto Sans Thai", sans-serif !important;
  font-style: normal !important;
}
@media (max-width: 600px) {
  .addr-card {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .addr-side {
    justify-items: start;
  }
}
</style>
