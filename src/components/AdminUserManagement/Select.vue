<template>
  <v-row>
    <v-col cols="12" md="4" class="d-flex align-end px-2">
      <v-text-field
        :value="search"
        placeholder="ค้นหาได้จากชื่อ-นามสกุล, ชื่อผู้ใช้ และอีเมล"
        hide-details
        outlined
        dense
        class="rounded-lg"
        clearable
        @input="$emit('update:search', $event)"
      >
        <template v-slot:append>
          <v-img
            src="@/assets/select/search_icon.png"
            width="16"
            height="16"
            class="mt-1"
            contain
          />
        </template>
      </v-text-field>
    </v-col>

    <v-col cols="12" md="2" class="px-2">
      <span class="title-select-text">สถานะผู้ใช้</span>
      <v-select
        v-model="statusModel"
        :items="statusItems"
        :menu-props="{ offsetY: true }"
        placeholder="ทั้งหมด"
        hide-details
        outlined
        dense
        class="rounded-lg"
        item-text="text"
        item-value="value"
      >
        <template v-slot:append>
          <v-img
            src="@/assets/select/expand_icon.png"
            width="16"
            height="16"
            contain
            class="icon-rotate mt-1"
          />
        </template>
      </v-select>
    </v-col>

    <v-col cols="12" md="3" class="px-2">
      <span class="title-select-text">วันที่ลงทะเบียน</span>
      <v-menu
        offset-y
        min-width="auto"
        v-model="menuDatePicker"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="formattedDate"
            readonly
            hide-details
            outlined
            dense
            placeholder="วว/ดด/ปปปป"
            v-on="on"
          >
            <template v-slot:append>
              <v-img
                src="@/assets/select/calenda_icon.png"
                width="16"
                height="16"
                contain
                class="mt-1"
              />
            </template>
          </v-text-field>
        </template>

        <v-date-picker
          v-model="internalDate"
          :picker-date.sync="pickerDate"
          locale="th-TH-u-ca-gregory"
          no-title
        />
      </v-menu>
    </v-col>

    <v-col cols="12" md="1" class="d-flex justify-start align-end px-2">
      <span
        class="clear-btn-text mb-2"
        style="color: #5c96f8; cursor: pointer"
        @click="clearFilters"
      >
        ล้างค่า
      </span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "UserSelect",
  props: {
    search: { type: String, default: "" },
    selectedRole: { type: String, default: "all" },
    selectedStatus: { type: String, default: "all" },
  },

  data() {
    return {
      menuDatePicker: false,
      internalDate: null,
      pickerDate: new Date().toISOString().substr(0, 7),
      statusItems: [
        { text: "ทั้งหมด", value: "all" },
        { text: "กำลังใช้งาน", value: "active" },
        { text: "ช่วง 7 วันที่ผ่านมา", value: "inactive" },
        { text: "ถูกระงับบัญชี", value: "suspended" },
      ],
    };
  },

  computed: {
    roleModel: {
      get() {
        return this.selectedRole || "all";
      },
      set(v) {
        this.$emit("update:selected-role", v);
      },
    },
    statusModel: {
      get() {
        return this.selectedStatus || "all";
      },
      set(v) {
        this.$emit("update:selected-status", v);
      },
    },

    formattedDate() {
      if (!this.internalDate) return "";

      const d = new Date(this.internalDate);
      if (isNaN(d)) return "";

      const opt = { day: "numeric", month: "long", year: "numeric" };
      return d.toLocaleDateString("th-TH", opt);
    },
  },

  watch: {
    internalDate(newVal) {
      if (!newVal) {
        this.$emit("update:date-range", []);
        return;
      }

      const d = new Date(newVal);
      if (isNaN(d)) {
        this.$emit("update:date-range", []);
        return;
      }

      this.$emit("update:date-range", [newVal, newVal]);
      this.menuDatePicker = false;
    },
  },

  methods: {
    clearFilters() {
      this.$emit("update:search", "");
      this.$emit("update:selected-role", "all");
      this.$emit("update:selected-status", "all");
      this.internalDate = null;
      this.pickerDate = new Date().toISOString().substr(0, 7);
      this.$emit("update:date-range", []);
    },
  },
};
</script>

<style scoped>
.title-select-text {
  font-size: 16px;
  font-weight: 400;
  color: #1f2a39;
}
.clear-btn-text {
  font-size: 14px;
  font-weight: 400;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e7eb !important;
  border-radius: 8px !important;
}
.clear-btn-text:hover {
  text-decoration: underline;
}
.v-select .icon-rotate {
  transition: transform 0.3s ease;
  transform: rotate(0deg);
}
.v-select.v-select--is-menu-active .icon-rotate {
  transform: rotate(180deg);
}
::v-deep(.v-select__selections),
::v-deep(.v-text-field__slot),
::v-deep(.v-label) {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #1f2a39 !important;
}
::v-deep(.v-picker) {
  box-shadow: none !important;
  border: none !important;
}
</style>