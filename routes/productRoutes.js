const express=require('express')
const router=express.Router()

const{
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}=require('../controllers/productController')

const {getSingleProductReviews}=require('../controllers/reviewController')

const {authentication,authorization}=require('../middleware/authentication')
router.route('/').get(getAllProducts).post(authentication,authorization('admin'),createProduct)
router.route('/upload').post(authentication,authorization('admin'),uploadImage)
router.route('/:id').get(getSingleProduct).delete(authentication,authorization('admin'),deleteProduct).patch(authentication,authorization('admin'),updateProduct)

router.route('/:id/reviews').get(getSingleProductReviews)

module.exports=router