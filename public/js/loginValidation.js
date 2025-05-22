document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".login-container form");

  form.addEventListener("submit", function (event) {
    if (!validateLoginForm()) {
      event.preventDefault();
    }
  });

  function validateLoginForm() {
    let isValid = true;

    // Validation de l'email
    const email = document.getElementById("email").value.trim();
    if (email === "") {
      alert("L'email est requis");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Veuillez entrer une adresse email valide");
      isValid = false;
    }

    // Validation du mot de passe
    const password = document.getElementById("password").value;
    if (password === "") {
      alert("Le mot de passe est requis");
      isValid = false;
    }

    return isValid;
  }
});
