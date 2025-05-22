document.querySelectorAll(".action-details").forEach((button) => {
  button.addEventListener("click", function () {
    const modalId = button.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
    }
  });
});

document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    const modalId = closeBtn.getAttribute("data-close");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
    }
  });
});
