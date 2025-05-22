const validateLoginData = (data) => {
  const errors = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("L'email est invalide");
  }

  if (!data.password) {
    errors.push("Le mot de passe est requis");
  }

  return errors;
};

export default validateLoginData;
