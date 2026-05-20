import { Timestamp } from "mongodb";
import mongoose, { Schema } from "mongoose";
import { use } from "react";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
      required: false,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
}); // This pre-save hook will hash the password before saving the user document to the database. It checks if the password field has been modified, and if so, it hashes the password using bcrypt with a salt rounds of 10.

userSchema.methods.isPasswordCorrect = async function (passowrd) {
  return await bcrypt.compare(passowrd, this.password);
}; // this custom function will be used to compare the password entered by the user with the hashed password stored in the database

// userSchema.methods.generateAcccessToken = async function () {}
// This custom function will be used to generate a JWT access token for the user. It can include the user's ID and any other relevant information in the token payload, and sign it with a secret key.

userSchema.methods.generateAccessToken = async function () {
  // jwt.sign(payload, secret, options)
  return jwt.sign(
    // payload:-Payload k andar stored data.
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    // secret key
    process.env.ACCESS_TOKEN_SECRET,
    // options
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
}; // This custom function generates a JWT access token for the user. It includes the user's ID, email, username, and fullname in the token payload, and signs it with a secret key defined in the environment variables. The token also has an expiration time specified in the environment variables.

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    // payload
    {
      _id: this._id,
    },
    // secret key
    process.env.REFRESH_TOKEN_SECRET,

    // options
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
}; // This custom function generates a JWT refresh token for the user. It includes the user's ID in the token payload, and signs it with a secret key defined in the environment variables. The token also has an expiration time specified in the environment variables. The generated refresh token is then stored in the user's document in the database and returned by the function.

export const User = mongoose.model("User", userSchema);
