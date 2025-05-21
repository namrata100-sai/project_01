import  express  from 'express';
import {registerController, testController} from '../controllers/authController.js'
import { loginController } from '../controllers/authController.js';
import { requireSignIn } from '../middlewares/authmiddleware.js';
import { isAdmin } from '../middlewares/authmiddleware.js';
import userModel from '../models/userModel.js';


const router = express.Router()

// REGISTER ||METHOD POST

router.post('/register',registerController)

// LOGIN || POST
router.post('/login',loginController)

router.get("/dashboard",  (req , res)=>{
res.send({message:"hello from dashboard"})
})

 router.get("/dashboard-admin",async (req , res)=>{
  
     const user = await userModel.find({},{password:0})

    res.send({message:"hello from admin dashboard" , user})
    })
    

 
router.get("/test",requireSignIn,isAdmin,testController);

export default router