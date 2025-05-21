// backend/controllers/categoryController.js

import slugify from "slugify";
import categoryModel from "../models/categoryModel.js"; // ← Don't forget .js extension if using ES Modules


// create - Catregory
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).send({ message: 'Name is required' }); // ← use res.status not req.status
    }

    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: 'Category already exists',
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    return res.status(201).send({
      success: true,
      message: 'New category created ✅',
      category,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in category controller ❌',
    });
  }
};

// updated category
export const updatedCatagoryController =  async (req , res)=>
{
        try {
           const  {name} = req.body;
           const {id} = req.params
           const category = await categoryModel.findByIdAndUpdate(
            id, {name},
            {new:true}
           )
          
            res.status(200).send({
            success:true,
            message:'category Updated Successfully',
            category,
            id
           })

        } catch (error) {
          console.log(error)
          res.status(500).send({
            success:false,
            message:"error in updating",
            error
          })
        } 
}


// get all category
export const allCategory = async(req, res)=>
  {
        try {
          
         const category = await categoryModel.find({})
         if(!category)
         {
            return  res.status(500).send({message:"error will fetching the category"})
         }
         return res.status(200).send({success:true , message:"all Gategory", categories: category, })
          
        } catch (error) {
          console.log("not rescive category")
          res.status(500).send({
            success:false,
            message:"error to fetch the category",
            error
          })
        }
      } 

       // get singleCategory
       export const singleCategory  = async(req, res)=>
       {
             try {
              // const {name }= req.body
              const {single} = req.params
              const getSingle = await categoryModel.findOne({slug : single})
              console.log(getSingle)
              if(!getSingle)
              {
                return res.status(401).send({message : "not fetch"})
              }
              return res.status(200).send({
                success:true,
                message:"successfully getting single category",
                getSingle
              })
               
             } catch (error) {
              res.status(500)
              .send({
                success:false,
                message:"error to fetch single category",
                single
              })
             }
            
       }

      //  delete category
      export const deleteCategory = async(req , res)=>
        {
            try {
              
              const {id} = req.params
              const deletecat = await categoryModel.findByIdAndDelete(id)
              console.log(deletecat)
              if(!deletecat)
              {
                 return res.status(401).send({success:false, message:"category is not found or already  deleted"})
              }
              
              return res.status(200).send({success:true , message:"category is deleted succesfully" , deletecat})
              

            } catch (error) {
              return res.send({message: "error will deleting" , error})
           
            }
              
        } 
      


   


