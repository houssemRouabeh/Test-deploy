// Fonction de validation des données
const validateRegisterData = async (data) => {
  const errors = [];

  // Validation du nom
  if (!data.lastname || !/^[a-zA-ZÀ-ÿ\- ]+$/.test(data.lastname)) {
    errors.push("Le nom est invalide");
  }

  // Validation du prénom
  if (!data.firstname || !/^[a-zA-ZÀ-ÿ\- ]+$/.test(data.firstname)) {
    errors.push("Le prénom est invalide");
  }

  // Validation de la date de naissance
  if (!data.birthdate) {
    errors.push("La date de naissance est requise");
  } else {
    const birthDate = new Date(data.birthdate);
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
      errors.push("Vous devez avoir au moins 18 ans pour vous inscrire");
    }
  }

  // Validation de l'adresse
  if (!data.address) {
    errors.push("L'adresse est requise");
  }

  // Validation de l'email
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("L'email est invalide");
  } else {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      errors.push("Cet email est déjà utilisé");
    }
  }

  // Validation du téléphone
  if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
    errors.push("Le numéro de téléphone est invalide");
  }

  // Validation du mot de passe
  if (!data.password || data.password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  } else if (
    !/[A-Z]/.test(data.password) ||
    !/[a-z]/.test(data.password) ||
    !/[0-9]/.test(data.password)
  ) {
    errors.push(
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    );
  }

  // Validation de la confirmation du mot de passe
  if (data.password !== data["confirm-password"]) {
    errors.push("Les mots de passe ne correspondent pas");
  }

  return errors;
};
export default validateRegisterData;
