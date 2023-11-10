const express = require('express')
const dbConnect = require('./config/dbConnect')
const dotenv = require('dotenv').config()
const authRoute = require('./routes/authRoute')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoute')
const categoryRouter = require('./routes/categoryRoute')
const blogCategoryRouter = require('./routes/blogCatRoute')
const brandRouter = require('./routes/brandRoute')
const couponRouter = require('./routes/couponRoute')
const bodyParser = require('body-parser')
const asyncHandler = require('express-async-handler')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const app = express()
dbConnect()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/api/user', authRoute)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blogcategory', blogCategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)


app.use(notFound)
app.use(errorHandler)

app.listen(4000, (req, res) => {
console.log('Server is running on 4000');
});