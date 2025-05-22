document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("forgot-password-modal");
    const openBtn = document.getElementById("forgot-password-link");
    const closeBtn = document.querySelector(".close-button");
  
    // Ouvrir le modal
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.remove("hidden");
    });
  
    // Fermer le modal
    closeBtn.addEventListener("click", function () {
      modal.classList.add("hidden");
    });
  });
  