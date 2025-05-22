import db from "../../models/index.js";
import bcrypt from "bcrypt";

const { User } = db;

// Fonction pour récupérer la liste de tous les utilisateurs depuis la BDD
export const listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "locality",
        "telephone",
        "role",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Rendre la vue avec la liste des utilisateurs
    return users;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).send("Erreur du serveur");
  }
};

// Fonction pour enregistrer un nouvel utilisateur dans la base de données (admin)
export const createUser = async (req, res) => {
  try {
    const {
      lastname,
      firstname,
      birthdate,
      address,
      email,
      phone,
      password,
      role,
    } = req.body; // Extraire les données du formulaire

    // Vérification des mots de passe
    if (password !== req.body["confirm-password"]) {
      return res.status(400).send("Les mots de passe ne correspondent pas");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Créer un utilisateur dans la base de données
    await User.create({
      firstName: firstname,
      lastName: lastname,
      birthday: birthdate,
      locality: address,
      email,
      telephone: phone,
      password: hashedPassword,
      role,
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Erreur lors de l’inscription :", error);
    res.status(500).send("Erreur lors de l’inscription");
  }
};

// Fonction pour mettre à jour les informations d’un utilisateur
export const updateUser = async (req, res) => {
  const {
    userId,
    lastname,
    firstname,
    birthdate,
    address,
    email,
    phone,
    password,
    role,
  } = req.body;

  try {
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    user.lastName = lastname;
    user.firstName = firstname;
    user.birthday = birthdate;
    user.locality = address;
    user.email = email;
    user.telephone = phone;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).send("Erreur serveur");
  }
};

// Fonction pour supprimer un utilisateur de la base de données
export const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    await db.User.destroy({ where: { id: userId } });
    res.redirect("/admin/dashboard"); // adapte si besoin
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).send("Erreur serveur.");
  }
};
