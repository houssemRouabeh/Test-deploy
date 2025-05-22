const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "partner") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Accès refusé : droits partenaire requis" });
};

export default isAdmin;
