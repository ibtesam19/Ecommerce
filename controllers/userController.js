const userModel=require('../models/userModel')
const customError=require('../errors')
const mongoose=require('mongoose')
const {generateTokenUser,getToken,verifyToken,attachCookie,checkRoles}=require('../utils')

const getAllUsers=async(req,res)=>{
    const users=await userModel.find({roles:'user'}).select('-password')
    res.json(users)
}

const getSingleUser=async(req,res)=>{
    
    const user=await userModel.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new customError.BadRequestError('invaid credentials')
    }
    checkRoles(req.user,user._id)
    res.json(user)

}

const showCurrentUser=async(req,res)=>{
    res.json(req.user)
}

const updateUserPassword=async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await userModel.findOne({_id:req.user._id})
    let isMatched=await user.comparePasswords(oldPassword)
    if(!isMatched){
        throw new customError.UnauthenticatedError('your current password does not match')
    }
    user.password=newPassword
    await user.save()
    res.json({msg:'success'})
}

const updateUser=async(req,res)=>{
    const {name,email}=req.body
    if(!email || !name){
        throw new customError.BadRequestError('plz provide name and email')
    }
    // const user=await userModel.findOneAndUpdate({_id:req.user._id},{name,email},{runValidators:true,new:true}).select('-password')
    const user=await userModel.findOne({_id:req.user._id})
    user.name=name
    user.email=email
    await user.save()
    attachCookie(res,generateTokenUser(user))
    res.json(user)
}

module.exports={
    getAllUsers,
    showCurrentUser,
    getSingleUser,
    updateUser,
    updateUserPassword
}