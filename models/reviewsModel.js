const mongoose=require('mongoose')
const { CustomAPIError } = require('../errors')
const reviewSchema=new mongoose.Schema({

    rating:{
        type:Number,
        required:[true,'rating is required'],
        min:1,
        max:5
    },

    title:{
        type:String,
        required:[true,'title is required']
    },

    comment:{
        type:String,
        required:[true,'comment is required']
    },

    user:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:[true,'user is required'],
        
    },

    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:[true,'product is required'],
    },


},
    {timestamps:true}
)

reviewSchema.index({product:1,user:1},{unique:true})


reviewSchema.statics.avgRatingandNmOfReviews=async function(productId){
    const result=await this.aggregate([
        {
            $match:{product:productId}
        },
        {
            $group:{_id:'$product',
            averageRating:{$avg:'$rating'},
            numberOfReviews:{$sum:1}}
        }
    ])
    
     console.log(result)
     await this.model('Product').findOneAndUpdate({_id:productId},{
        averageRating:Math.ceil(result[0]?.averageRating || 0),
        numberOfReviews:result[0]?.numberOfReviews || 0
     })
}

reviewSchema.post('save',async function(){
    this.constructor.avgRatingandNmOfReviews(this.product)
})

reviewSchema.post('remove',async function(){
    this.constructor.avgRatingandNmOfReviews(this.product)
})

module.exports=mongoose.model('Reviews',reviewSchema)