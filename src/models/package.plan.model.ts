import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const packagePlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      alias: 'n',
    },
    description: {
      type: String,
      default: '',
      alias: 'd',
    },

    subscribe: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
