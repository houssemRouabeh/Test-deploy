document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("Inscription");

  form.addEventListener("submit", function (event) {
    if (!validateRegisterForm()) {
      event.preventDefault();
    }
  });

  function validateRegisterForm() {
    let isValid = true;

    // Validation du nom
    const lastname = document.getElementById("lastname").value.trim();
    if (lastname === "") {
      alert("Le nom est requis");
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\- ]+$/.test(lastname)) {
      alert("Le nom ne doit contenir que des lettres");
      isValid = false;
    }

    // Validation du prénom
    const firstname = document.getElementById("firstname").value.trim();
    if (firstname === "") {
      alert("Le prénom est requis");
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\- ]+$/.test(firstname)) {
      alert("Le prénom ne doit contenir que des lettres");
      isValid = false;
    }

    // Validation de la date de naissance
    const birthdate = document.getElementById("birthdate").value;
    if (birthdate === "") {
      alert("La date de naissance est requise");
      isValid = false;
    } else {
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        alert("Vous devez avoir au moins 18 ans pour vous inscrire");
        isValid = false;
      }
    }

    // Validation de l'adresse
    const address = document.getElementById("address").value.trim();
    if (address === "") {
      alert("L'adresse est requise");
      isValid = false;
    }

    // Validation de l'email
    const email = document.getElementById("email").value.trim();
    if (email === "") {
      alert("L'email est requis");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Veuillez entrer une adresse email valide");
      isValid = false;
    }

    // Validation du téléphone
    const phone = document.getElementById("phone").value.trim();
    if (phone === "") {
      alert("Le numéro de téléphone est requis");
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      alert("Le numéro de téléphone doit contenir exactement 10 chiffres");
      isValid = false;
    }

    // Validation du mot de passe
    const password = document.getElementById("password").value;
    if (password === "") {
      alert("Le mot de passe est requis");
      isValid = false;
    } else if (password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      isValid = false;
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      alert(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      );
      isValid = false;
    }

    // Validation de la confirmation du mot de passe
    const confirmPassword = document.getElementById("confirm-password").value;
    if (confirmPassword === "") {
      alert("Veuillez confirmer votre mot de passe");
      isValid = false;
    } else if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      isValid = false;
    }

    return isValid;
  }
});
