const express=require('express')
const app=express()
require('dotenv').config()
require('express-async-errors')

const connectDb=require('./db/connect')
const errorHandler=require('./middleware/error-handler')
const notFound=require('./middleware/not-found')
const fileUpload=require('express-fileupload')

app.use(express.static('./public'))

const authrouter=require('./routes/authroutes')
const userrouter=require('./routes/userRoutes')
const productrouter=require('./routes/productRoutes')
const reviewrouter=require('./routes/reviewRoutes')
const orderrouter=require('./routes/orderRoutes')

const cors=require('cors')
app.use(cors())
const morgan=require('morgan')
const cookieParser=require('cookie-parser')
const { authentication } = require('./middleware/authentication')

// app.use('/',(req,res)=>{
//     res.send('home page')
// })


app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRETKEY))
app.use(fileUpload())


app.use('/api/v1/user',userrouter)
app.use('/api/v1/auth',authrouter)
app.use('/api/v1/products',productrouter)
app.use('/api/v1/reviews',reviewrouter)
app.use('/api/v1/orders',authentication,orderrouter)

app.use(notFound)
app.use(errorHandler)


const port=process.env.PORT || 5000;
const start=async()=>{
await connectDb(process.env.MONGO_URI)
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
}
start()