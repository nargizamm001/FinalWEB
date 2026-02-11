const checkRole = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.role;
  if (!role) return res.status(403).json({ error: "Forbidden" });
  if (!allowedRoles.includes(role)) return res.status(403).json({ error: "Forbidden" });
  next();
};

module.exports = checkRole;