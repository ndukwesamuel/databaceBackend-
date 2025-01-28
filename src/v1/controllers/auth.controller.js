import asyncWrapper from "../../middlewares/asyncWrapper.js";
import authService from "../../v1/services/auth.service.js";
import guarantorModel from "../models/guarantor.model.js";

export const register = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const result = await authService.register(userData);
  res.status(201).json(result);
});

export const login = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const result = await authService.login(userData);
  res.status(200).json(result);
});

export const getUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await authService.getUser(userId);
  res.status(200).json(result);
});

export const sendOTP = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.sendOTP({ email });
  res.status(200).json(result);
});

export const verifyOTP = asyncWrapper(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP({ email, otp });
  res.status(200).json(result);
});

export const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.forgotPassword({ email });
  res.status(200).json(result);
});

export const resetPassword = asyncWrapper(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const result = await authService.resetPassword({ email, otp, password });
  res.status(200).json(result);
});

// export const createGuarantor = async (req, res) => {
//   try {
//     const { guarantorId, signature, photo, dojah } = req.body;

//     // Create a new Guarantor document
//     const newGuarantor = new guarantorModel({
//       guarantorId,
//       signature,
//       photo,
//       dojah,
//     });

//     // Save the document to the database
//     await newGuarantor.save();

//     // Return the created document
//     res.status(201).json(newGuarantor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createGuarantor = async (req, res) => {
  try {
    const { guarantorId, signature, photo, dojah } = req.body;

    // Check if a guarantor with the same guarantorId exists
    const existingGuarantor = await guarantorModel.findOne({ guarantorId });

    if (existingGuarantor) {
      // Delete the existing guarantor
      await guarantorModel.deleteOne({ guarantorId });
      console.log(`Guarantor with ID ${guarantorId} deleted successfully.`);
    }

    // Create a new Guarantor document
    const newGuarantor = new guarantorModel({
      guarantorId,
      signature,
      photo,
      dojah,
    });

    // Save the document to the database
    await newGuarantor.save();

    // Return the created document
    res.status(201).json({
      success: true,
      message: "Guarantor created successfully",
      data: newGuarantor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating guarantor",
      error: error.message,
    });
  }
};

// export const Guarantor_webhook = async (req, res) => {
//   try {
//     const webhook = req.body;
//     let main_id = webhook?.metadata?.user_id;
//     let photo = webhook?.selfie_url;
//     let verification_status = webhook?.verification_status;

//     console.log({
//       main_id,
//       photo,
//       verification_status,
//       xxxx: webhook,
//     });

//     res.status(201).json({
//       photo,
//       verification_status,
//       dojah,
//       data,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const GuarantorDetails = async (req, res) => {
//   try {
//     const { guarantorId, signature, photo, dojah } = req.body;

//     // Create a new Guarantor document
//     const newGuarantor = new guarantorModel({
//       guarantorId,
//       signature,
//       photo,
//       dojah,
//     });

//     // Save the document to the database
//     await newGuarantor.save();

//     // Return the created document
//     res.status(201).json(newGuarantor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import mongoose from "mongoose";
import Guarantor from "../models/Guarantor"; // Import Guarantor model
import User from "../models/User"; // Import User model

export const Guarantor_webhook = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start transaction

    const webhook = req.body;
    const main_id = webhook?.metadata?.user_id;
    const photo = webhook?.selfie_url;
    const verification_status = webhook?.verification_status;
    const dojah = webhook?.dojah; // Assuming dojah is part of the webhook data

    console.log({
      main_id,
      photo,
      verification_status,
      dojah,
      webhook, // Logging the full webhook for debugging
    });

    // Step 1: Find the Guarantor based on main_id
    const guarantor = await Guarantor.findOne({ guarantorId: main_id }).session(
      session
    );

    if (!guarantor) {
      throw new Error("Guarantor not found.");
    }

    // Step 2: Update the Guarantor document
    guarantor.photo = photo || guarantor.photo; // Update photo if provided
    guarantor.dojah = dojah || guarantor.dojah; // Update dojah data if provided
    guarantor.verification_status =
      verification_status || guarantor.verification_status; // Update verification_status if provided

    // Save updated Guarantor document within the session
    await guarantor.save({ session });

    console.log({
      bbbb: guarantor,
    });

    // Step 4: Commit transaction if both updates are successful
    await session.commitTransaction();
    session.endSession(); // End the session

    // Send successful response
    res.status(200).json({
      message: "Guarantor and User updated successfully.",
      photo,
      verification_status,
      dojah,
    });
  } catch (error) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession(); // End the session

    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getGuarantorById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log({
      ggg: id,
    });

    const guarantor = await guarantorModel.find({ guarantorId: id }); // Fetch guarantor by ID

    res.status(200).json({ success: true, data: guarantor });
    // res.status(200).json({ success: true, data: id });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching guarantor details",
      error,
    });
  }
};

export const Guarantor_webhook_get = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: "guarantor" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching guarantor details",
      error,
    });
  }
};

// export default { register, login, getUser };
