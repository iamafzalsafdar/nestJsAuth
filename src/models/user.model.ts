import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const userSchema = new Schema(
  {
    username: {
      type: String,
      default: '',
      alias: 'usn',
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      alias: 'em',
      trim: true,
    },
    password: {
      type: String,
      required: true,
      alias: 'pss',
      trim: true,
    },

    password_hash: {
      type: String,
      required: true,
      trim: true,
    },
    access_token: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);
