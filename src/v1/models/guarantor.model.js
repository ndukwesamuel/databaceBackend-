import mongoose from "mongoose";

const { Schema } = mongoose;

const guarantorSchema = new Schema(
  {
    guarantorId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    verification_status: {
      type: String,
    },
    dojah: {
      type: Object,
    }, // Added missing closing curly brace
  },
  {
    timestamps: true, // Moved timestamps to the correct position
  }
);

export default mongoose.model("Guarantor", guarantorSchema);
