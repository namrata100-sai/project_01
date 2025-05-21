import   express  from 'express';
import { allCategory, createCategoryController, deleteCategory, singleCategory, updatedCatagoryController } from '../controllers/categoryController.js';




const router = express.Router()

router.post('/create-category', createCategoryController)
router.put('/update-category/:id', updatedCatagoryController)
router.get('/get-category', allCategory)
router.get('/single-category/:single', singleCategory)
router.delete('/delete-category/:id', deleteCategory)




export default router
