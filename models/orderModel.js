const mongoose =require('mongoose')

const cartItemSchema=new mongoose.Schema({

    name:{type:String,required:true},
    image:{type:String,required:true},
    price:{type:Number,required:true},
    amount:{type:Number,required:true},
    product:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'Product'
            }

})

const orderSchema=new mongoose.Schema({

    tax:{
        type:Number,
        required:true
    },
    shippingFee:{
        type:Number,
        required:true
    },
    subTotal:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    cartItems:[cartItemSchema],
    status:{
        type:String,
        enum:['pending','paid','canceled','delivered','failed'],
        default:'pending'
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:true
    },
    clientSecret:{
        type:String,
        required:true
    },
    paymentIntentId:{
        type:String,
    },
},

    {timestamps:true}

    )

    module.exports=mongoose.model('Orders',orderSchema)