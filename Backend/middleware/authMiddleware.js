import jwt from "jsonwebtoken";
import User from "../model/Usermodel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token = req.cookies.token;

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.userid);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
