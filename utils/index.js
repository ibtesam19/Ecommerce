const {verifyToken,getToken,attachCookie,generateTokenUser}=require('./tokens')
const {checkRoles}=require('./checkRoles')

module.exports={
    verifyToken,
    getToken,
    attachCookie,
    generateTokenUser,
    checkRoles
}