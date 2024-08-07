const User = require("../models/user.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/sendEmail");
const generateToken = require("../utils/jwtToken");

module.exports.Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    // existing user check
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, message: "Email already exists" });
    }

    //   hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}/api/v1/auth/${newUser._id}/verify/${token.token}`;
    const emailTemplate = `
    <h1>Click on the button below to verify your email address:</h1>
    <center>
    <a href="${url}" style="background-color: #4CAF50; color: white; font-size:20px; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
    </center>
  `;
    await sendMail(
      newUser.email,
      "Note App - Verify Your Email",
      emailTemplate
    );
    res.status(200).send({
      error: false,
      message: "Verification Email Sent to Your Account Please Verify",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: true, message: "Incorrect password" });
    }

    if (!user.verified) {
      const token = await Token.findOne({ userId: user._id });
      if (token) {
        return res
          .status(401)
          .json({ error: true, message: "Please verify your email first" });
      } else {
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}/api/v1/auth/${user._id}/verify/${token.token}`;
        const emailTemplate = `
    <h1>Click on the button below to verify your email address:</h1>
    <center>
    <a href="${url}" style="background-color: #4CAF50; color: white; font-size:20px; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
    </center>
  `;
        await sendMail(
          user.email,
          "Note App - Verify Your Email",
          emailTemplate
        );
        return res.status(200).json({
          error: true,
          message: "Verification Email sent. Please verify your email first!",
        });
      }
    }
    generateToken(user, res);

    return res.json({
      error: false,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });
    res
      .status(200)
      .json({ error: false, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports.VerifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send({ error: true, message: "Invalid Link" });
    }
    let token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(404).send({ error: true, message: "Invalid Token" });
    }

    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.deleteOne({ _id: token._id });
    res
      .status(200)
      .send({ error: false, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
      return res.status(404).send({ error: true, message: "User not found" });
    }
    res.json({ error: false, user: isUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: true, message: "User not found with this email" });
    }

    const token = await Token.findOne({ userId: user._id });
    if (token) {
      return res
        .status(401)
        .json({ error: true, message: "Password reset link already sent to your email." });
    } else {
      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.FRONTEND_URL}/api/v1/auth/${user._id}/reset-password/${token.token}`;
      const emailTemplate = `
    <h1>Reset Password Request:</h1>
    <p>Click on the button below to reset your password:</p>
    <center>
    <a href="${url}" style="background-color: #4CAF50; color: white; font-size:20px; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-
    : 5px;">Reset Password</a>
    </center>
    `;
      await sendMail(user.email, "Note App - Reset Password", emailTemplate);
      res
        .status(200)
        .json({ error: false, message: "Reset Password Email sent" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if(!password) {
      return res.status(400).send({ error: true, message: "Password is required" });
    }

    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send({ error: true, message: "User not Found" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(404).send({ error: true, message: "Invalid Token" });
    }

    //   hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne({ _id: user._id }, { password: hashedPassword });
    await Token.deleteOne({ userId: user._id });

    res
      .status(200)
      .send({ error: false, message: "Password Reset Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

