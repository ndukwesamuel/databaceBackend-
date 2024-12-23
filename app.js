import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/connectDB.js";
import notFound from "./src/middlewares/notFound.js";
import { errorMiddleware } from "./src/middlewares/error.js";
import User from "./src/v1/models/user.model.js";
import authRoutesV1 from "./src/v1/routes/auth.routes.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude the password field
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/api", async (req, res) => {
  try {
    const users = [];

    // Generate 100 random users
    for (let i = 0; i < 100; i++) {
      const randomEmail = `user${Math.floor(
        Math.random() * 100000
      )}@example.com`;
      const randomPassword = Math.random().toString(36).slice(-8); // Generate a random 8-character password

      users.push({
        email: randomEmail,
        password: randomPassword, // Hash the password in a real application
        roles: ["user"],
      });
    }

    // Insert users into the database
    await User.insertMany(users);

    res.status(201).json({
      success: true,
      message: "100 random users added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add random users",
      error: error.message,
    });
  }
});

app.use("/api/v1/auth", authRoutesV1);
// app.use("/api/v1/admin", adminRoutes);
app.use(notFound);
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB(
      "mongodb+srv://webuyam23:8Zal2faU1es1FK4C@cluster0.rsqd24c.mongodb.net/"
    );
    console.log(`DB Connected!`);
    app.listen(port, () => console.log(`Server is listening on PORT:${port}`));
  } catch (error) {
    console.log(`Couldn't connect because of ${error.message}`);
    process.exit(1);
  }
};

startServer();
