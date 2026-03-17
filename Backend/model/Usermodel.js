import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const TransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ["sent", "received"], required: true },
    date: { type: Date, default: Date.now },
    otherUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
    otherUserName: { type: String},
    category:{type:String}
  },
  { _id: false } 
);

const MoneyRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    fromUserName: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    date: { type: Date, default: Date.now }
  }
);

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    balance: { type: Number, default: 100000 },
    accountNumber: { type: String, unique: true },
    phone: { type: String },
    address: { type: String },
    pin: { type: String, required: true, minlength: 4 },
    transactions: [TransactionSchema],
    moneyRequests: [MoneyRequestSchema]
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified("pin")) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

const User = mongoose.models.user || mongoose.model("user", UserSchema);
export default User;
