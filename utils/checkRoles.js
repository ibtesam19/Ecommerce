const customError=require('../errors')

const checkRoles=(currentUser,RequestedUserId)=>{
    console.log(currentUser)
    console.log(RequestedUserId)
    if(currentUser.roles==='admin') return
    if(currentUser._id===RequestedUserId.toString()) return
    throw new customError.UnauthenticatedError('unauthorized to access this route')
}
module.exports={
    checkRoles
}