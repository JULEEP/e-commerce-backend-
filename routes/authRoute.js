const express = require('express');
const {createUser,
    loginUserCtrl,
     getallUser,
      getaUser,
       deleteaUser, 
       updateaUser,
       blockUser,
       unblocked,
       userCart,
       getUserCart,
       emptyCart,
       applyCoupon,
       createOrder,
       getOrder,
       updateOrderStatus,
     }= require('../controllers/userCntrl');
const {authMiddleware, isAdmin }= require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.post('/cart', userCart)
router.get('/all-users', getallUser)
router.get('/:id', authMiddleware,isAdmin, getaUser)
router.delete('/:id', deleteaUser)
router.put('/edit-user',authMiddleware, updateaUser)
router.put('/block-user/id',authMiddleware,isAdmin, blockUser)
router.put('/unblock-user/id',authMiddleware,isAdmin, unblocked)
router.get('/cart',authMiddleware, getUserCart)
router.delete('/empty-cart', authMiddleware, emptyCart)
router.post('/cart/applycoupon',authMiddleware, applyCoupon)
router.post('/cart/cash-order', authMiddleware, createOrder)
router.get('/get-orders',authMiddleware, getOrder)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
module.exports = router
