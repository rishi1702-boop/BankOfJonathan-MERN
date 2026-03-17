import AppError from "../utils/AppError.js";

// This should always be used AFTER the `protect` middleware
export const restrictToAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError("You do not have permission to perform this action", 403));
};
