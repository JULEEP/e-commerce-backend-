const express = require('express');
const { createBlog,
     updateBlog,
      getBlog,
       getAllBlog,
        deleteBlog,
         likeBlog } = require('../controllers/blogCntrl');
const router = express.Router();
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')


router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.put('/likes', authMiddleware,likeBlog)
//router.put(
     //"/upload/:id", 
    // authMiddleware,
     // isAdmin, 
      //uploadPhoto.array('images', 10),
      //blogImgResize, 
     // uploadImages)

module.exports = router