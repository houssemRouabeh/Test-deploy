export default async function validateUpadateProfile(data) {
  const errors = [];

  // Validation du nom
  if (!data.lastName || !/^[a-zA-ZÀ-ÿ\- ]+$/.test(data.lastName)) {
    errors.push("Le nom est invalide");
  }

  // Validation du prénom
  if (!data.firstName || !/^[a-zA-ZÀ-ÿ\- ]+$/.test(data.firstName)) {
    errors.push("Le prénom est invalide");
  }

  // Validation de la date de naissance (optionnelle pour mise à jour)
  if (data.birthdate) {
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
      errors.push("Vous devez avoir au moins 18 ans");
    }
  }

  // Validation de l'adresse (optionnelle pour mise à jour)
  if (data.address && data.address.trim().length === 0) {
    errors.push("L'adresse est invalide");
  }

  // Validation de l'email
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("L'email est invalide");
  }

  // Validation du téléphone
  if (data.phone && !/^[0-9]{10}$/.test(data.phone)) {
    errors.push("Le numéro de téléphone est invalide");
  }

  // Validation du mot de passe (seulement si fourni)
  if (data.password) {
    if (data.password.length < 8) {
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
  }

  return errors;
}
