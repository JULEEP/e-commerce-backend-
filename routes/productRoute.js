const express = require('express');
const router = express.Router();
const { createProduct,
     getaProduct,
      getAllProduct,
       updateProduct,
        deleteProduct,
        uploadImages,
     } = require('../controllers/productCntrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');


router.post('/', createProduct)
router.get('/:id', getaProduct)
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10),productImgResize, uploadImages)
router.get('/', getAllProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router