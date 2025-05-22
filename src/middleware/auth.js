import jwt from "jsonwebtoken";
import db from "../../models/index.js";

const { User } = db;

export const jwtAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
        redirectTo: "/login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable",
        redirectTo: "/login",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      telephone: user.telephone,
      birthday: user.birthday,
      locality: user.locality,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error.message);

    const response = {
      success: false,
      message: "Session invalide ou expirée",
      redirectTo: "/login",
    };

    if (error instanceof jwt.TokenExpiredError) {
      response.message = "Session expirée";
    } else if (error instanceof jwt.JsonWebTokenError) {
      response.message = "Token invalide";
    }

    return res.status(401).json(response);
  }
};
