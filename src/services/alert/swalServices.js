import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@/styles/swal.css";
import checkImg from "@/assets/check.png";
import cancelImg from "@/assets/cancel.png";

const swalAlert = {
  Dialog(
    title,
    message,
    imageUrl,
    imageWidth,
    imageHeight,
    confirmText,
    cancelText,
    showCancel = true
  ) {
    return Swal.fire({
      title: title,
      html: `<div class="swal-text">${message}</div>`,
      imageUrl: imageUrl,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      imageAlt: "Custom image",
      showCancelButton: showCancel,
      focusConfirm: false,
      showCloseButton: true,
      confirmButtonText: confirmText || "ยืนยัน",
      cancelButtonText: cancelText || "ยกเลิก",
      confirmButtonColor: "#cf2e18",
      cancelButtonColor: "#fef2f2",
      reverseButtons: true,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel outline",
      },
    });
  },

  Confirm({
    title,
    message,
    confirmText = "ยืนยัน",
    cancelText = "ยกเลิก",
    icon = "question",
  }) {
    return Swal.fire({
      title,
      html: message ? `<div class="swal-text">${message}</div>` : undefined,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      focusConfirm: false,
      showCloseButton: true,
      reverseButtons: true,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel outline",
      },
    });
  },

  CancelDocumentWithReason(title, label) {
    return Swal.fire({
      title: title,
      html: `
      <div class="textarea-card">
        <label class="textarea-label" for="cancelReason">${label}</label>
        <div class="textarea-wrapper">
          <textarea id="cancelReason" placeholder="ระบุเหตุผล"></textarea>
          <div class="textarea-resize-icon"></div>
        </div>
      </div>
    `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D7000A",
      cancelButtonColor: "#ffffff",
      reverseButtons: true,

      preConfirm: () => {
        const textarea = document.getElementById("cancelReason");
        const value = textarea.value.trim();
        if (!value) {
          Swal.showValidationMessage("กรุณากรอกเหตุผลก่อนยืนยัน");
          return false;
        }
        return value;
      },

      willOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        confirmBtn.disabled = true;
      },

      didOpen: () => {
        const textarea = document.getElementById("cancelReason");
        const resizeIcon = textarea.nextElementSibling;
        const minHeight = 86;

        const confirmBtn = Swal.getConfirmButton();

        function autoGrow() {
          textarea.style.height = "auto";
          let newHeight = textarea.scrollHeight;
          if (newHeight < minHeight) newHeight = minHeight;
          textarea.style.height = newHeight + "px";
        }

        function toggleConfirmButton() {
          confirmBtn.disabled = textarea.value.trim() === "";
        }

        textarea.addEventListener("input", () => {
          autoGrow();
          toggleConfirmButton();
        });

        resizeIcon.addEventListener("mousedown", (e) => {
          e.preventDefault();
          const startY = e.clientY;
          const startHeight = textarea.offsetHeight;

          function onMouseMove(e) {
            let newHeight = startHeight + (e.clientY - startY);
            if (newHeight < minHeight) newHeight = minHeight;
            textarea.style.height = newHeight + "px";
          }

          function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          }

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
      },

      customClass: {
        popup: "swal-popup-cancel-document",
        title: "swal-title-cancel-document",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel outline",
      },
    });
  },

  Success(title) {
    return Swal.fire({
      title: title,
      imageUrl: checkImg,
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
      timer: 3000,
      customClass: {
        popup: "swal-popup-success",
        image: "swal-image-circle",
        title: "swal-title-success",
      },
    });
  },

  Error(title, message = "") {
    return Swal.fire({
      title: title,
      imageUrl: cancelImg,
      imageWidth: 80,
      imageHeight: 80,
      html: message ? `<div class="swal-text">${message}</div>` : undefined,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
      timer: 3000,
      customClass: {
        popup: "swal-popup",
        image: "swal-image-circle",
        title: "swal-title",
      },
      didOpen: () => {
        const active = document.activeElement;
        if (active && active.classList.contains("swal2-close")) {
          active.blur();
        }
        const popup = Swal.getPopup();
        if (popup) popup.focus();
      },
    });
  },

  Warning(title, message = "") {
    return Swal.fire({
      title: title,
      html: message ? `<div class="swal-text">${message}</div>` : undefined,
      icon: "warning",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3000,
      focusConfirm: false, // ป้องกัน focus ไปปุ่ม confirm ที่ไม่มี
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.focus(); // ให้ focus อยู่บน popup เอง
        }
      },
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
      },
    });
  },
};

export default swalAlert;
