const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Accès refusé : droits chef de projet requis" });
};

export default isAdmin;
