const customError=require('../errors')
const reviewModel=require('../models/reviewsModel')
const productModel=require('../models/productModel')
const {checkRoles}=require('../utils')


const createReview=async(req,res)=>{
    req.body.user=req.user._id
    const {product:product_id}=req.body
    const isProductValid=await productModel.findOne({_id:product_id})
    if(!isProductValid){
        throw new customError.BadRequestError('invalid product')
    }
    const checkReview=await reviewModel.findOne({user:req.user._id,product:product_id})
    if(checkReview){
        throw new customError.BadRequestError('you already entered your review')
    }
    const review=await reviewModel.create(req.body)
    res.json({review})

}


const getAllReview=async(req,res)=>{

    const Reviews=await reviewModel.find({})
    .populate({
        path:'product',select:'price name'
    })
    .populate({
        path:'user',select:'name'
    })
    res.json({Reviews,size:Reviews.length})
}



const getSingleReview=async(req,res)=>{
    const {id}=req.params
    const Review=await reviewModel.findOne({_id:id})
    res.json(Review)
}



const updateReview=async(req,res)=>{
    const {id}=req.params
    const updated=await reviewModel.findOne({_id:id})
    checkRoles(req.user,updated.user)
    updated.comment=req.body.comment
    updated.rating=req.body.rating
    updated.title=req.body.title
    await updated.save()
    res.json({updated})
}


const deleteReview=async(req,res)=>{
    const {id}=req.params
    const deleted=await reviewModel.findOne({_id:id})
    console.log(req.user,deleted.user)
    checkRoles(req.user,deleted.user)
    await deleted.remove()
    res.json(deleted)
}

const getSingleProductReviews=async(req,res)=>{
    const reviews=await reviewModel.find({product:req.params.id})
    res.json(reviews)
}

module.exports={
    createReview,
    getAllReview,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}