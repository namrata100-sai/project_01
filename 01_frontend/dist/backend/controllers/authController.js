import userModel from "../models/userModel.js"
import JWT from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config({path:"./backend/.env"});
const JWT_SECRET=process.env.JWT_SECRET||"my_super_secret_key_12345";

export const registerController = async (req, res) => {
    console.log("Register Request Body:", req.body);
    try {
      const { name, email, password, phone, address } = req.body;
  
      if (!name)
        return res.status(400).send({ success: false, message: "Name is required" });
      if (!email)
        return res.status(400).send({ success: false, message: "Email is required" });
      if (!password)
        return res.status(400).send({ success: false, message: "Password is required" });
      if (!phone)
        return res
          .status(400)
          .send({ success: false, message: "Phone number is required" });
      if (!address)
        return res
          .status(400)
          .send({ success: false, message: "Address is required" });
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          success: false,
          message: "Already registered. Please log in.",
        });
      }
  
      const user = await new userModel({
        name,
        email,
        password, // you should hash this in production!
        phone,
        address,
      }).save();
  
      return res.status(201).send({
        success: true,
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error("Caught Error:", error);
      return res.status(500).send({
        success: false,
        message: "Something went wrong in registration",
        error: error.message,
      });
    }
  };
  
    
    


// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if the password matches (no hashing here)
    if (password !== user.password) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate a JWT token
    const token = JWT.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expiration time
    );

    // Respond with user data, including phone and address
    return res.status(200).json({
      success: true,
      message: user.role === 1 ? "Admin login successful" : "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,       // Include phone in response
        address: user.address,   // Include address in response
        role: user.role,         // Include role in response
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};


//logout



 //test
 export const testController = (req,res)=>
    {
        console.log("protected route")
        res.send("protected")
    }

