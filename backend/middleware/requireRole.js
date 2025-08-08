function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ error: 'No role in token' });
    if (!roles.includes(role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
module.exports = requireRole;