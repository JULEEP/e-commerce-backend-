const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')


const createBlog = asyncHandler(async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)

    }catch(error){
        throw new Error(error);
    }
})

const updateBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedBlog)

    }catch(error){
        throw new Error(error);
    }
})

const getBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const getBlog = await Blog.findById(id);
        await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1},
            },
            {new: true}
        )
        res.json(getBlog)

    }catch(error){
        throw new Error(error);
    }
})

const getAllBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const getallBlog = await Blog.findById(id);
        res.json(getallBlog)

    }catch(error){
        throw new Error(error);
    }
})

const deleteBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog)

    }catch(error){
        throw new Error(error);
    }
})

const likeBlog = asyncHandler(async(req, res) => {
    const { blogId } = req.body
    const blog = await Blog.findById(blogId)

    const loginUserId = req.user?._id;

    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
        (userId = userId?.toString() === loginUserId?.toString())
    )
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        },
        {
            new: true,
        } 
        )
        res.json(blog)
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isLiked: false,
        },
        {
            new: true,
        } 
        )
        res.json(blog)

    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes: loginUserId},
            isDisliked: true,
        },
        {
            new: true,
        } 
        )
        res.json(blog)
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
        const findBlog = await Product.findByIdAndUpdate(
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
        res.json(findBlog)

    }catch(error){
        throw new Error(error)
    }
})


module.exports = {createBlog,
     updateBlog,
      getBlog,
       getAllBlog,
        deleteBlog,
        uploadImages,
         likeBlog}