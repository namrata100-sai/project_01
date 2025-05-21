import mongoose from "mongoose";

const productShema = new mongoose.Schema({

    name :{
        type:String,
        required : true
    },
    slug:
    {
        type:String,                                                           
        required:true,
    },
    brand:
    {
        type:String,
        required:true
    },
    description:
    {
        type:String,
        required:true
    },
    price:
    {
        type : Number,
        required:true
    },
     costPrice: { // 🔥 Add this line (Cost price for profit calculation)
         type: Number,
         required: true
     },
    unit:
    {
        type : String,
        required:true
    },
     category:
     {
         type : mongoose.ObjectId,
         ref :'Category',
         required:true,
     },
    quantity:
    {
        type:Number,
        required:true
    },
    photo:
    {
        data :Buffer,
        contentType : String
    },
    shipping:
    {
        type : Boolean
    }
},{timestamps :true})

export default mongoose.model('products', productShema)