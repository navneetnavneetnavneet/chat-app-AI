module.exports.sendToken = async (user, statusCode, res) => {
  const token = await user.generateToken();

  const options = {
    expire: new Date(
      Date.now() + 24 * 60 * 60 * 1000 + process.env.COOKIE_EXPIRE
    ),
    httpOnly: true,
    secure: false,
    sameSite: "None",
  };

  delete user._doc.password;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    _id: user._id,
    token: token,
    // user: user,
  });
};
