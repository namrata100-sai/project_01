 import   JWT  from 'jsonwebtoken';
 import dotenv from 'dotenv';
 dotenv.config({path:"./backend/.env"});
 const JWT_SECRET=process.env.JWT_SECRET||"my_super_secret_key_12345";
 import userModel from '../models/userModel.js';
 
 

//protedted routes token base
 export const  requireSignIn= async(req , res , next)=>
 {
     try {

        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

     const decoded = JWT.verify(token,JWT_SECRET)
     if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded
     next()
} catch (error) {
         console.log(error)
        res.send("error in token")
     } 
 }


 // admin acceess
 export const isAdmin = async(req,res,next) =>
    {
        try {
               
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No user data found"
                });
            }

            const user = await userModel.findById(req.user.userId)
            if(user.role!==1)
            {
                return res.status(401).send({
                    success:false,
                    message:"UnAuthorized Access"
                })
            }else
            {
                next();
            }
            
        } catch (error) {
            console.log(error)
        }
    }