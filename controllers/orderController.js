const customError=require('../errors')
const product=require('../models/productModel')
const orderModel=require('../models/orderModel')
const {checkRoles}=require('../utils')

const getAllOrders=async(req,res)=>{
    const orders=await orderModel.find({})    
    res.json(orders)    
}

const getSingleOrders=async(req,res)=>{
    const order=await orderModel.findOne({_id:req.params.id})
    checkRoles(req.user,order.user)
    res.json(order)    
}
const getCurrentUserOrders=async(req,res)=>{
    const userId=req.user._id
    const orders=await orderModel.find({user:userId})
    res.json(orders)    
}  

const CreateOrders=async(req,res)=>{

    const fakeStripeApi=({amount,currency})=>{
        const client_secret='randomclientsecret'
        return {client_secret,amount}
    }

    const {items,shippingFee,tax}=req.body
    if(!items || items.length<1){
        throw new customError.BadRequestError('you have no items in cart')
    }
    if(!shippingFee || !tax){
        throw new customError.BadRequestError('incomplete order')
    }
    let subTotal=0;
    let cartItems=[];

    for(const item of items){
        const dbProduct=await product.findOne({_id:item.product})
        if(!dbProduct){
            throw new customError.BadRequestError('this item is not available')
        }
        const {name,image,price}=dbProduct
        const {amount}=item
        const cartProduct={
            name,
            price,
            image,
            amount,
            product:dbProduct._id
        }

        cartItems=[...cartItems,cartProduct]
        subTotal+=item.amount*price

    }

    const total=subTotal+tax+shippingFee
    const paymentIntent=await fakeStripeApi({
        amount:total,
        currency:'usd'
    })
    
    const order=await orderModel.create(
    {   
        total,
        cartItems,
        tax,
        subTotal,
        clientSecret:paymentIntent.client_secret,
        shippingFee,
        user:req.user._id

        }
    )

    res.json(order)    
}

const updateOrders=async(req,res)=>{
    const order =await orderModel.findOne({_id:req.params.id})
    const {paymentIntent}=req.body
    checkRoles(req.user,order.user)
    order.clientSecret=paymentIntent
    await order.save()
    res.json(order)    
}

module.exports={
    updateOrders,
    CreateOrders,
    getAllOrders,
    getCurrentUserOrders,
    getSingleOrders
}