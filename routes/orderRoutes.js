
const {
    updateOrders,
    CreateOrders,
    getAllOrders,
    getCurrentUserOrders,
    getSingleOrders
}=require('../controllers/orderController')

const express=require('express')
const { authorization } = require('../middleware/authentication')
const router=express.Router()

router.route('/').get(authorization('admin'),getAllOrders).post(CreateOrders)
router.route('/showAllMyOrders').get(getCurrentUserOrders)
router.route('/:id').get(getSingleOrders).patch(updateOrders)

module.exports=router