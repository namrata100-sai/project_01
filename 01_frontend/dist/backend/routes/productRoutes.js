import  express  from 'express';
import { createProductController, deleteProductController, getProductController, ProductDetailController, productPhotoController, SearchProductController, singleProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';
const router = express.Router()

//rotes
router.post('/create-product', formidable(), createProductController)
router.get('/get-product', getProductController)
router.get("/single-product/:single", singleProductController)
 router.get("/product-detail/:slug", ProductDetailController)


//get photo
router.get('/photo-product/:pid' , productPhotoController)
router.get('/delete-product/:id', deleteProductController)
router.put('/update-product/:id',formidable(), updateProductController)
router.get('/search-product/:keyword', SearchProductController)

export default router