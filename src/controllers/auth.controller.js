import db from "../../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validateRegisterData from "../utils/validateRegisterData.js";
import validateLoginData from "../utils/validateLoginData.js";
const { User } = db;

export const registerUser = async (req, res) => {
  try {
    const validationErrors = await validateRegisterData(req.body);

    if (validationErrors.length > 0) {
      return res.render("auth/register", {
        errors: validationErrors,
        success: "",
        formData: req.body, // Pour pré-remplir le formulaire
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création de l'utilisateur
    await User.create({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      birthday: req.body.birthdate,
      locality: req.body.address,
      email: req.body.email,
      telephone: req.body.phone,
      password: hashedPassword,
      role: "user", // Par défaut, on met 'user'
    });
    // En cas de succès :
    req.flash("success", "Inscription réussie !");
    return res.redirect("/login");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'inscription",
    });
  }
};

export const login = async (req, res) => {
  try {
    const validationErrors = validateLoginData(req.body);

    if (validationErrors.length > 0) {
      return res.render("auth/login", {
        messages: { error: validationErrors },
        formData: req.body,
      });
    }

    const user = await User.scope("withPassword").findOne({
      where: { email: req.body.email },
    });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!user) {
      return res.render("auth/login", {
        messages: { error: ["Identifiants incorrects"] },
        formData: req.body,
      });
    }

    if (!isMatch) {
      return res.render("auth/login", {
        messages: { error: ["Identifiants incorrects"] },
        formData: req.body,
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 heure
      domain: "localhost",
    });

    // Redirection avec message de succès
    req.flash("success", `Bienvenue ${user.firstName} !`);
    const redirectTo =
      {
        admin: "/admin/dashboard",
        manager: "/manager/dashboard",
        partner: "/partner/dashboard",
      }[user.role] || "/user/dashboard";

    res.redirect(redirectTo);
  } catch (error) {
    console.error("Erreur de connexion:", error);
    req.flash("error", "Erreur serveur lors de la connexion");
    res.redirect("/login");
  }
};

// Fonction de déconnexion
export const logout = (req, res) => {
  if (req.logout) {
    req.logout(() => {});
  }

  // Suppression du cookie contenant le JWT
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    domain: "localhost",
  });

  req.flash("success", "Déconnexion réussie !");
  res.redirect("/login");
};
