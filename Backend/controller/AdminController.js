import User from "../model/Usermodel.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get system-wide statistics for the admin dashboard
// @route   GET /admin/stats
// @access  Private/Admin
export const getSystemStats = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  
  const totalUsers = users.length;
  
  let totalSystemBalance = 0;
  let totalTransactionsCount = 0;
  let totalMoneyMoved = 0;

  users.forEach(user => {
    totalSystemBalance += user.balance;
    totalTransactionsCount += user.transactions.length;
    
    // Only counting sent amounts to avoid double counting internal transfers
    user.transactions.forEach(tx => {
       if(tx.type === 'sent') {
           totalMoneyMoved += tx.amount;
       }
    });
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalSystemBalance,
      totalTransactionsCount,
      totalMoneyMoved
    }
  });
});

// @desc    Get all users list for admin
// @route   GET /admin/users
// @access  Private/Admin
export const getAllUsersAdmin = catchAsync(async (req, res, next) => {
  // Excluding passwords and pins
  const users = await User.find({}).select('-password -pin -transactions');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});
