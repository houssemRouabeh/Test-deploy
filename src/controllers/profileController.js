import db from "../../models/index.js";
import bcrypt from "bcrypt";
import validateUpadateProfile from "../utils/updateProfileValidator.js";

export const updateProfile = async (req, res) => {
  try {
    // Récupération des données du formulaire
    const {
      firstName,
      lastName,
      email,
      phone,
      birthdate,
      address,
      locality,
      avatar,
      password,
    } = req.body;

    // Préparation des données pour la validation
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      birthdate,
      address,
      password,
    };

    // Validation des données
    const validationErrors = await validateUpadateProfile(userData);

    // Vérification de l'email unique (sauf si c'est le sien)
    if (email !== req.user.email) {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        validationErrors.push("Cet email est déjà utilisé par un autre compte");
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    // Préparation des données de mise à jour
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      birthdate: new Date(birthdate),
      address,
      locality,
      avatar: avatar || req.user.avatar,
    };

    // Hashage du mot de passe si fourni
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Mise à jour de l'utilisateur
    const [updatedRows] = await db.User.update(updateData, {
      where: { id: req.user.id },
    });

    if (updatedRows === 0) {
      throw new Error("Aucun utilisateur trouvé pour la mise à jour");
    }

    // Redirection selon le rôle de l'utilisateur
    let redirectPath;
    switch (req.user.role) {
      case "admin":
        redirectPath = "/admin/dashboard/profile";
        break;
      case "manager":
        redirectPath = "/manager/dashboard/profile";
        break;
      case "partner":
        redirectPath = "/partner/dashboard/profile";
        break;
      case "user":
      default:
        redirectPath = "/user/dashboard/profile";
    }

    res.redirect(redirectPath);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du profil",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
