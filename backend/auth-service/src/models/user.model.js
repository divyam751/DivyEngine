import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import toTitleCase from "../utils/formatter.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/constant.js";


const userSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      default: uuidv4,
      index: true,
      immutable: true,
    },

    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      set: toTitleCase,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // hides password from query results by default
    },

    role: {
      type: String,
      lowercase: true,
      enum: ["admin", "lister", "customer"],
      default: "customer",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id; // hide internal _id
        delete ret.password; // hide password even if selected manually
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const payload = { publicId: this.publicId, role: this.role };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const User = mongoose.model("User", userSchema);

export default User;
