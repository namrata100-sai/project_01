import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cors from 'cors';
import axios from "axios";
import orderRoutes from './routes/orderRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// const dotenv = require('dotenv'); // for CommonJS
 

const app = express();

//new  lines
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '01_frontend', 'dist', 'index.html'));
});

//up to this


//  env configaration
dotenv.config({path:"./backend/.env"});
connectDB()

const PORT = process.env.PORT ||3000;
const mode = process.env.DEV_MODE || "development";

// middelwares
app.use(express.json());
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(path.join(__dirname , './01_frontend/build')))



app.listen(PORT,()=>
{
    console.log(`Server running on ${mode} at ${PORT} `);
})


// routes
app.use('*',function(req,res)
{
  res.sendFile(path.join(__dirname,'./01_frontend/build/index.html'))
})
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes)
app.use('/api/orders' ,orderRoutes);


 app.get('/api/config/paypal',(req, res) => {
     res.send("AcskyMCyz75zor1_p2BA_-wcTr_6A4CufUOtARUOGzbqDPDLNGwm5mtOQzlszEmrlqQUJWwaMhOzJzoy"); 
   })

  

   app.post('/api/create-order', async (req, res) => {
     const { amount } = req.body;
   
     try {
       // Replace with your actual PayPal sandbox client ID and secret
       const clientId = "AcskyMCyz75zor1_p2BA_-wcTr_6A4CufUOtARUOGzbqDPDLNGwm5mtOQzlszEmrlqQUJWwaMhOzJzoy";
       const clientSecret = "EJTEPF5CzdiqucUlE2S7UcTbFLbO4oDgR3oKbz67idAXE7JQJpX1ZNfF20XLHbeNq7No95VhbI3qLArT";
   
       // Get access token
       const { data: authData } = await axios({
         url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
         method: "post",
         headers: {
           "Content-Type": "application/x-www-form-urlencoded",
         },
         auth: {
           username: clientId,
           password: clientSecret,
         },
         data: "grant_type=client_credentials",
       });
   
       const accessToken = authData.access_token;
   
       // Create order
       const { data } = await axios.post(
         "https://api-m.sandbox.paypal.com/v2/checkout/orders",
         {
           intent: "CAPTURE",
           purchase_units: [
             {
               amount: {
                 currency_code: "USD",
                 value: amount,
               },
             },
           ],
         },
         {
           headers: {
             Authorization: `Bearer ${accessToken}`,
             "Content-Type": "application/json",
           },
         }
       );
   
       res.json({ orderID: data.id });
     } catch (err) {
       console.error("Error creating PayPal order:", err);
       res.status(500).send("Payment creation failed");
     }
   });
   


app.get('/',(req , res)=>
{
        res.send(
             '<h1> Constraction store</h1>'
        )
})
