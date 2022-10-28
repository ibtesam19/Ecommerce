const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'name is required '],
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        required:[true,'plz provide email'],
        trim:true,
        validate:{
            validator:validator.isEmail,
            message:'plz provide valid email'
        },
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
    },
    roles:{
        type:String,
        enum:['user','admin'],
        default:'user'    
    }   
})

    userSchema.pre('save',async function(){
        // if(this.isModified(this.password)){
        const salt=await bcrypt.genSaltSync(10)
        this.password=await bcrypt.hash(this.password,salt)
        // }
    })

    userSchema.methods.comparePasswords=async function(p){
        const a=await bcrypt.compare(p,this.password)
        return a
    }

module.exports=mongoose.model('users',userSchema)