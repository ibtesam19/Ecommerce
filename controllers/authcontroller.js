const userModel=require('../models/userModel')
const {NotFoundError,BadRequestError,UnauthenticatedError}=require('../errors/index')
const {StatusCodes}=require('http-status-codes')
const {attachCookie,generateTokenUser}=require('../utils')
    
    const register=async(req,res)=>{

        const {name,email,password}=req.body
        const ifFirstDocument=(await userModel.countDocuments({}))===0
        const roles=ifFirstDocument? 'admin':'user' 
        const user=await userModel.create({email,password,name,roles})
        const tokenPayload=generateTokenUser(user)
        attachCookie(res,tokenPayload)
        res.status(StatusCodes.CREATED).json({tokenPayload})

    }


    const login=async(req,res)=>{
        const {email,password}=req.body
        if(!email || !password){
            throw new BadRequestError('plz provide email and password')
        }
        const user=await userModel.findOne({email})
        const matchPassword=await user.comparePasswords(password)
        if(!matchPassword){
            throw new UnauthenticatedError('wrong password')
        }
        const tokenPayload=generateTokenUser(user)
        attachCookie(res,tokenPayload)
        res.status(StatusCodes.OK).json({user})
    }   

const logout=(req,res)=>{
    res.cookie(
        'token',
        'loggOut',
        {
            httpOnly:true,
            expires:new Date(Date.now()),
            secure:process.env.ENV_VAR==='production',
            signed:true,
        }
    )
    res.send('logged out')
}

module.exports={
    register,
    login,
    logout
}