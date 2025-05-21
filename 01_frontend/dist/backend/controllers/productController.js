
// import { message } from "antd";
import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const { name, brand, description, price, costPrice, unit, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !brand:
        return res.status(400).send({ error: "Brand is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price || isNaN(price) || Number(price) <= 0:
        return res.status(400).send({ error: "Valid price is required" });
      case !costPrice || isNaN(costPrice) || Number(costPrice) < 0:
        return res.status(400).send({ error: "Valid cost price is required" });
      case !unit:
        return res.status(400).send({ error: "Unit is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case shipping === undefined || shipping === "":
        return res.status(400).send({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const isShipping = shipping === "true" || shipping === true;

    const product = new productModel({
      ...req.fields,
      price: Number(price),
      costPrice: Number(costPrice),
      shipping: isShipping,
      slug: slugify(name),
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Error creating product:", error);
    res.status(500).send({
      success: false,
      message: "Error while creating product",
      error: error.message,
    });
  }
};

    


//  get products
export const getProductController = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = 12;

    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments();

    return res.status(200).send({
      success: true,
      message: "Fetched all products successfully",
      products,
      total,
    });
  } catch (error) {
    console.log("Error while getting products:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting products",
      error: error.message,
    });
  }
};



//single product

export const singleProductController = async (req, res) => {
  try {
    const { single } = req.params;
    const cleanId = single.trim(); // 🧹 Clean the id
    const fetchSingle = await productModel.findById(cleanId).select("-photo").populate("category");
    return res.status(200).send({
      success: true,
      message: "getting single products",
      fetchSingle,
    });
  } catch (error) {
    console.log("Error fetching single product:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching single product",
      error: error.message,
    });
  }
};



// product detail
 export const ProductDetailController = async (req, res) => {
   const  {slug } = req.params
      console.log(slug)
   try {
     const fetchProduct = await productModel
       .findOne({ slug })
       .select("-photo")
       .populate("category");

     if (!fetchProduct) {
       return res.status(404).send({
         success: false,
         message: "Product not found",
       });
     }

     return res.status(200).send({
       success: true,
       message: "Getting single product",
       fetchProduct,
     });

   } catch (error) {
     return res.status(500).send({
       success: false,
       message: "Error while getting product data",
       error: error.message,
     });
   }
 };


//get photo
export const productPhotoController = async (req,res)=>{

  try {

    const product = await productModel.findById(req.params.pid).select("photo")
      if(product.photo.data)
       {
         res.set("content-type",product.photo.contentType);
         return res.status(200).send(product.photo.data)
       }
    
  } catch (error) {
    console.log("Error while geting product:", error);
        res.status(500).send({
          success: false,
          message: "Error while geting product",
          error: error.message,
        });
        
    
  }
}

// delete product
export const deleteProductController = async (req, res)=>
{
    try {
      const id = req.params.id
      const deleteproduct = await productModel.findByIdAndDelete(id).select("-photo")
      return res.status(200).send({
        success:true,
        message:"deleted successfully",
        deleteproduct
      })

    } catch (error) {
      console.log("Error while deleting the product:", error);
        res.status(500).send({
          success: false,
          message: "Error while deleting the product",
          error: error.message,
        });

    }
}

//updated category
export const updateProductController = async (req, res) => {
  try {
    const { name, brand, description, price, costPrice, unit, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    // Update only if fields are provided
    if (name) {
      product.name = name;
      product.slug = slugify(name);
    }
    if (brand) product.brand = brand;
    if (description) product.description = description;
    if (price) product.price = Number(price);

    // ✅ costPrice validation and assignment
    if (costPrice !== undefined) {
      if (isNaN(costPrice) || Number(costPrice) < 0) {
        return res.status(400).send({ error: "Cost price must be 0 or more" });
      }
      product.costPrice = Number(costPrice);
    }

    if (unit) product.unit = unit;
    if (category) product.category = category;
    if (quantity) product.quantity = quantity;
    if (shipping !== undefined) {
      product.shipping = shipping === "true" || shipping === true;
    }

    if (photo) {
      if (photo.size > 1000000) {
        return res.status(400).send({ error: "Photo should be less than 1MB" });
      }
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("Error updating product:", error);
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};



// searching functionality
export const SearchProductController =async (req,res)=>
{
  try {
    const keyword = req.params.keyword
    const result = await productModel.find({
      $or:[
        {name:{$regex:keyword , $options:"i"}},
        {description:{$regex:keyword , $options:"i"}},

      ]
    }).select("-photo")
     res.status(200).send({message:"getting product successfully",
       result ,
       

     })
    // res.json(result)
  } catch (error) {
    res.status(400).send({
      message:"error while searching the product",
      error
    })
  }

}
