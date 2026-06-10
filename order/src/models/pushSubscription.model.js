import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    subscription: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PushSubscription = mongoose.model(
  "PushSubscription",
  pushSubscriptionSchema,
);
