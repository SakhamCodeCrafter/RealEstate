const User = require('../models/user.js');
const bcryptjs = require('bcryptjs');
const errorHandler = require('../util/error.js');
const jwt = require('jsonwebtoken');
const transporter = require("../mail/mail.js");
require('dotenv').config();

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: email,
        subject: "Thank You for Registering to Saksham Estate",
        text: `Hi ${
          username
        }, Welcome to Saksham Estate Family.`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });

    if (!validUser) {
      throw { status: 404,  message: 'No such user exist. Create a new account!' };
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      throw { status: 404, message: 'Wrong credentials!' };
    }
    

    const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('jwtoken', token, { httpOnly: true })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};



const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      
      res
        .cookie('jwtoken', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
        
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
      const { password: pass, ...rest } = newUser._doc;
      transporter.sendMail(
        {
          from: process.env.EMAIL,
          to: newUser.email,
          subject: "Thank You for Registering to Saksham Estate",
          text: `Hi ${
            newUser.username
          }, Welcome to Saksham Estate Family.`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
      res
        .cookie('jwtoken', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookie('jwtoken');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  google,
  signOut
};