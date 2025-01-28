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

export const Guarantor_webhook = async (req, res) => {
  try {
    const webhook = req.body;
    let dojah = webhook?.metadata?.user_id;
    let photo = webhook?.selfie_url;
    let verification_status = webhook?.verification_status;

    console.log({
      dojah,
      photo,
      verification_status,
      xxxx: webhook,
    });

    res.status(201).json({
      photo,
      verification_status,
      dojah,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
