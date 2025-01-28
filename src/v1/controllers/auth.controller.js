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

    console.log({
      xxxx: webhook,
    });

    let data = {
      metadata: {
        ipinfo: {
          status: "success",
          country: "Nigeria",
          city: "Lagos",
          district: "",
          zip: "",
          lat: 6.4474,
          lon: 3.3903,
          timezone: "Africa/Lagos",
          isp: "SP 120",
          org: "",
          as: "AS37340 SPECTRANET LIMITED",
          mobile: true,
          proxy: false,
          hosting: false,
          query: "154.120.84.68",
          region_name: "Lagos",
        },
        device_info:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        user_id: "199",
      },
      data: {
        index: {
          data: {},
          message: "Successfully continued to the main checks.",
          status: true,
        },
        selfie: {
          data: {
            selfie_url:
              "https://images.dojah.io/selfie_sample_image_1720624219.jpg",
          },
          message: "Successfully validated your liveness",
          status: true,
        },
      },
      message: "Successfully completed the verification.",
      reference_id: "DJ-E17536148B",
      widget_id: "678e30aed6a17fd17ac3ef7d",
      verification_mode: "",
      verification_type: null,
      verification_value: null,
      verification_url:
        "https://app.dojah.io/verifications/bio-data/5fe6fcfa-b4be-4759-a803-68a82147355e",
      selfie_url: "https://images.dojah.io/selfie_sample_image_1720624219.jpg",
      status: true,
      aml: { status: false },
      verification_status: "Completed",
    };
    // const { guarantorId, signature, photo, dojah } = req.body;

    // // Create a new Guarantor document
    // const newGuarantor = new guarantorModel({
    //   guarantorId,
    //   signature,
    //   photo,
    //   dojah,
    // });

    let dojah = data?.metadata?.user_id;
    let photo = data?.selfie_url;
    let verification_status = data?.verification_status;

    // // Save the document to the database
    // await newGuarantor.save();

    // Return the created document
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

// export default { register, login, getUser };
