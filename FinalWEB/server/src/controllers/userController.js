const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { ...(username !== undefined ? { username } : {}), ...(email !== undefined ? { email } : {}) },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

module.exports = { getProfile, updateProfile };
