const express=require('express')
const router=express.Router()

const {
    getAllUsers,
    showCurrentUser,
    getSingleUser,
    updateUser,
    updateUserPassword
}=require('../controllers/userController')
const {authentication,authorization}=require('../middleware/authentication')

router.route('/').get(authentication,authorization('admin'),getAllUsers)
router.route('/showMe').get(authentication,showCurrentUser)
router.route('/updateUser').patch(authentication,updateUser)
router.route('/updateUserPassword').patch(authentication,updateUserPassword)
router.route('/:id').get(authentication,getSingleUser)

module.exports=router