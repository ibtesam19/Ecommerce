const customError=require('../errors')
const {verifyToken,generateTokenUser}=require('../utils')
const jwt=require('jsonwebtoken')


const authentication=async(req,res,next)=>{
    const {token}=req.signedCookies
    if(!token){
        throw new customError.UnauthenticatedError('you need to login or register first')
    }
    try{
        const decode=verifyToken(token)
        req.user=generateTokenUser(decode)
        next()
    }
    catch(err){
        res.json({err})
    }
    
}

const authorization=(...a)=>{
    return (req,res,next)=>{
        if(!a.includes(req.user.roles)){
            throw new customError.UnauthenticatedError('unauthorized route')
        }
        next()
    }
}

module.exports={
    authentication,
    authorization
}