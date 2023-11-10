const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')

const createProduct = asyncHandler(async(req, res) => {
    try{
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    }catch(error){
        throw new Error(error)
    }
})

const getaProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const findProduct = await Product.findById(id)
        res.json(findProduct)

    }catch(error){
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async(req, res) => {
    try{
        const getAllProducts = await Product.find();
        res.json(getAllProducts)

    }catch(error){
        throw new Error(error);
    }
})

const updateProduct = asyncHandler(async(req, res) => {
    const id = req.params;
    try{
    const updateaProduct = await Product.findByIdAndUpdate({id}, req.body, {
        new: true,
    })
    res.json(updateaProduct)

    }catch(error) {
        throw new Error(error);
    }
})

const deleteProduct = asyncHandler(async(req, res) => {
    const id = req.params;
    try{
    const deleteaProduct = await Product.findByIdAndDelete(id)
    res.json(deleteaProduct)

    }catch(error) {
        throw new Error(error);
    }
})

const uploadImages = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls =[];
        const files = req.files;
        for(const file of files) {
            const { path } = files;
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file
                }),
            },
            {
                new: true,
            }
        )
        res.json(findProduct)

    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createProduct,
     getaProduct,
      getAllProduct,
       updateProduct,
       deleteProduct,
       uploadImages,
    }