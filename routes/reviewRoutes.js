const express=require('express')
const router=express.Router()
const {authentication,authorization}=require('../middleware/authentication')
const {
    createReview,
    getAllReview,
    getSingleReview,
    updateReview,
    deleteReview,

}=require('../controllers/reviewController')

router.route('/')
.get(getAllReview)
.post(authentication,createReview)


router.route('/:id')
.get(getSingleReview)
.patch(authentication,updateReview)
.delete(authentication,deleteReview)

module.exports=router