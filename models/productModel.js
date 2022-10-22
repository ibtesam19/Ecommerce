
const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'name is required'],
        minlength:3,
        maxlength:[100,'product name cant be more than 100 characters '],
        trim:true
    },

    price:{
        type:Number,
        required:[true,'price is required'],
        default:0
    },

    description:{
        type:String,
        required:[true,'description is required'],
        maxlength:[1000,'product name cant be more than 100 characters '],
    },

    image:{
        type:String,
        default:'/uploads/example.jpeg'
    },

    category:{
        type:String,
        required:[true,'category is required'],
        enum:['office','bedroom','kitchen']
    },

    company:{
        type:String,
        required:[true,'company is required'],
        enum:{
            values:['liddy','ikea','marcos'],
            message:'{VALUE} is not currently supported'
        },
    },

    colors:{
        type:[String],
        required:true,
        default:[
            '#222'
        ]
    },  

    featured:{
        type:Boolean,
        default:false,
    },

    freeShipping:{
        type:Boolean,
        default:false,
    },

    Inventory:{
        type:Number,
        required:[true,'inventory number is required'],
        default:15
    },

    averageRating:{
        type:Number,
        default:0 
    },

    numberOfReviews:{
        type:Number,
        default:0 
    },

    user:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:[true,'user is required']
    },
},

    {timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}}

    )

    productSchema.virtual('reviews',{
        ref:'Reviews',
        localField:'_id',
        foreignField:'product',
        justOne:false
    })
    
    productSchema.pre('remove',async function(){
        await this.model('Reviews').deleteMany({product:this._id})
    })

    module.exports=mongoose.model('Product',productSchema)