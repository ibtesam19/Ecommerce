const jwt=require('jsonwebtoken')

const generateTokenUser=(user)=>{
    return {name:user.name,_id:user._id,roles:user.roles}
}

const getToken=(payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRETKEY,{expiresIn:process.env.JWT_LIFETIME})
    return token
}

const verifyToken=(token)=>{
    const decode=jwt.verify(token,process.env.JWT_SECRETKEY)
    return decode
}

const attachCookie=(res,user)=>{
    const token=getToken(user)
    const oneDay=1000*60*60*24

        res.cookie('token',token,{
            expires: new Date(Date.now() + oneDay),
            httpOnly: true,
            secure:process.env.ENV_VAR==='production',
            signed:true
        })    
}

module.exports={
    getToken,
    verifyToken,
    attachCookie,
    generateTokenUser
}