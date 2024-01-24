const bcryptjs = require("bcryptjs");
const User = require("../models/user.js");
const { errorHandler } = require("../util/error.js");
const Listing = require("../models/listing.js");
const FormSubmission = require("../models/formSubmission.js");
const transporter = require("../mail/mail.js");
require('dotenv').config();

const test = (req, res) => {
  res.json({
    message: "API route is working!",
  });
};

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("jwtoken");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const submitForm = async (req, res, next) => {
  const { problemDescription, email } = req.body;

  try {
    const newFormSubmission = new FormSubmission({ problemDescription, email });
    await newFormSubmission.save();
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `New message from ${email}`,
        text: `
        Message :
        ${problemDescription}`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    console.log("Form submitted successfully!");
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error.message);
    next(error);
  }
};

module.exports = {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
  submitForm,
};
