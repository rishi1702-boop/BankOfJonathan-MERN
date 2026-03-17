// controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../model/Usermodel.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// Helper to generate random account number
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number
};

export const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, address, pin } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  // Create new user (password/pin hashing is now handled by Usermodel pre-save hook)
  const newUser = new User({
    firstName,
    lastName,
    email,
    password, // passed plainly, hashed in model
    phone,
    address,
    pin,      // passed plainly, hashed in model
    accountNumber: `AC${generateAccountNumber()}`,
    balance: 5000, 
    transactions: []// Default
  });

  await newUser.save();

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      accountNumber: newUser.accountNumber,
      balance: newUser.balance,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  
  if (!existingUser) {
    return next(new AppError("No user found with that email", 404));
  }
  const checkPassword = await bcrypt.compare(password, existingUser.password);
  if (!checkPassword) {
    return next(new AppError("Incorrect password", 401));
  }
  const token = jwt.sign({ userid: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .status(200)
    .json({ 
      status: "success", 
      message: "Logged in successfully", 
      user: existingUser 
    });
});

export const getuserbyid = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const foundUser = await User.findById(decoded?.userid);
  
  if (!foundUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  res.status(200).json({ status: "success", userdata: foundUser });
});

export const getusers = catchAsync(async (req, res, next) => {
  const Users = await User.find({});
  res.status(200).json({ status: "success", results: Users.length, Users });
});