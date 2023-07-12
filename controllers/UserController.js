const User = require('../models/User');
const bcrypt = require('bcrypt');

const getUserProfile = async (req, res) => {
  try {
    const userId = await req.user._id;

    const user = await User.findOne({_id: userId});

    await res.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        created_date: user.created_date,
      },
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const user = await req.user;

    const {oldPassword, newPassword} = req.body;

    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: 'Invalid password, try again',
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    await res.json({
      message: 'Password has been changed successfully!',
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = await req.user;
    await User.findOneAndRemove({_id: user._id});

    await res.json({
      message: `${user.email} has been removed successfully!`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

module.exports = {
  getUserProfile,
  changeUserPassword,
  removeUser,
};
