import User from "../model/Usermodel.js";
import bcrypt from "bcryptjs";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const Sender = catchAsync(async (req, res, next) => {
  const { receiverid, amount, pin, description } = req.body;
  const senderid = req.user._id; // Provided by protect middleware
  const amt = Number(amount);
 
  if (amt <= 0) {
    return next(new AppError("Amount must be greater than zero", 400));
  }

  // Update balances in parallel
  const currentUser = req.user; // We already have the user from middleware
  const otherUser = await User.findById(receiverid);

  if (!otherUser) {
    return next(new AppError("Receiver not found", 404));
  }

  const matchPin = await bcrypt.compare(pin, currentUser.pin);
  
  if(matchPin){
    if (currentUser.balance < amt) {
      return next(new AppError("Insufficient balance", 400));
    }

    await Promise.all([
      User.findByIdAndUpdate(receiverid, { $inc: { balance: amt }, $push: {
        transactions: {
          amount: amt,
          description,
          type: "received",
          otherUserId: senderid,
          otherUserName: currentUser.firstName
        }
      }}),
      User.findByIdAndUpdate(senderid, { $inc: { balance: -amt },  $push: {
        transactions: {
          amount: amt,
          description,
          type: "sent",
          otherUserId: receiverid,
          otherUserName: otherUser.firstName
        }
      } })
    ]);
  } else {
    return next(new AppError("Failed in Sending. Incorrect Pin", 401));
  }

  res.status(200).json({
    status: "success",
    message: "Transaction completed",
  });
});

export const RequestMoney = catchAsync(async (req, res, next) => {
  const { receiverid, amount, description } = req.body;
  const currentUser = req.user;
  const amt = Number(amount);

  if (amt <= 0) {
    return next(new AppError("Amount must be greater than zero", 400));
  }

  const otherUser = await User.findById(receiverid);
  if (!otherUser) {
    return next(new AppError("Requested user not found", 404));
  }

  const newRequest = {
    fromUserId: currentUser._id,
    fromUserName: currentUser.firstName,
    amount: amt,
    description: description || "Money request",
    status: "pending"
  };

  await User.findByIdAndUpdate(receiverid, {
    $push: { moneyRequests: newRequest }
  });

  res.status(200).json({
    status: "success",
    message: "Money request sent successfully",
  });
});

export const ApproveRequest = catchAsync(async (req, res, next) => {
  const { requestId, pin } = req.body;
  const currentUser = req.user;

  // Find the request in current user's moneyRequests array
  const request = currentUser.moneyRequests.id(requestId);
  
  if (!request) {
    return next(new AppError("Request not found", 404));
  }
  
  if (request.status !== "pending") {
    return next(new AppError("Request is already processed", 400));
  }

  const matchPin = await bcrypt.compare(pin, currentUser.pin);
  if (!matchPin) {
    return next(new AppError("Incorrect Pin", 401));
  }

  if (currentUser.balance < request.amount) {
    return next(new AppError("Insufficient balance to approve request", 400));
  }

  const requester = await User.findById(request.fromUserId);
  if (!requester) {
    return next(new AppError("The user who requested the money no longer exists", 404));
  }

  // Same logic as Sender: Current user sends money to requester
  await Promise.all([
    User.findByIdAndUpdate(requester._id, { 
      $inc: { balance: request.amount }, 
      $push: {
        transactions: {
          amount: request.amount,
          description: request.description,
          type: "received",
          otherUserId: currentUser._id,
          otherUserName: currentUser.firstName
        }
      }
    }),
    User.updateOne(
      { _id: currentUser._id, "moneyRequests._id": requestId },
      { 
        $inc: { balance: -request.amount },  
        $push: {
          transactions: {
            amount: request.amount,
            description: request.description,
            type: "sent",
            otherUserId: requester._id,
            otherUserName: requester.firstName
          }
        },
        $set: { "moneyRequests.$.status": "approved" }
      }
    )
  ]);

  res.status(200).json({
    status: "success",
    message: "Request approved and money sent",
  });
});

export const DeclineRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.body;
  const currentUser = req.user;

  const request = currentUser.moneyRequests.id(requestId);
  
  if (!request) {
    return next(new AppError("Request not found", 404));
  }

  await User.updateOne(
    { _id: currentUser._id, "moneyRequests._id": requestId },
    { $set: { "moneyRequests.$.status": "rejected" } }
  );

  res.status(200).json({
    status: "success",
    message: "Request declined",
  });
});