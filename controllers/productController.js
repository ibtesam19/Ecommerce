
const productModel=require('../models/productModel')
const path=require('path')
const { findByIdAndUpdate } = require('../models/productModel')

const createProduct=async(req,res)=>{

    req.body.user=req.user._id
    console.log(req.user._id);
    const newProduct=await productModel.create(req.body)
    res.json({newProduct})

}


const getAllProducts=async(req,res)=>{

    const products=await productModel.find({}).populate('reviews')
    res.json(products)

}


const getSingleProduct=async(req,res)=>{

    const product=await productModel.findById({_id:req.params.id})
    res.json(product)

}


const updateProduct=async(req,res)=>{

    const product=await productModel.findOne({_id:req.params.id},req.body,{runValidators:true,new:true})
    res.json(product)

}


const deleteProduct=async(req,res)=>{

    const product=await productModel.findOne({_id:req.params.id})
    await product.remove()
    res.json({msg:'success! product removed'})

}


const uploadImage=async(req,res)=>{

    console.log(req.files);
    const image=req.files.image
    const Imagepath=path.join(__dirname,`../public/uploads/${image.name}`)
    image.mv(Imagepath)
    res.json({path:`/uploads/${image.name}`})
}

module.exports={
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}