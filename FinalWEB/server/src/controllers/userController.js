const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // если email меняют — проверим, что он не занят другим пользователем
    if (email) {
      const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (exists) return res.status(400).json({ error: "Email already in use" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {})
      },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

module.exports = { getProfile, updateProfile };