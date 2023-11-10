const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')
const unique = require('unique')


const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      throw new Error("User Already Exists");
    }
  }

)

const loginUserCtrl = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password)){
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    }else{
        throw new Error('Invalid Credentials')
    }
})

//get all user
const getallUser = asyncHandler(async(req, res) => {
    try{
        const getUser = await User.find();
        res.json(getUser)

    }catch(error){
        throw new Error(error);
    }
})

//get a singleUser

const getaUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const getAuse = await User.findById(id)
        res.json({
            getAuse,
        })

    }catch(error){
        throw new Error(error)

    }
})

//delete a user
const deleteaUser = asyncHandler(async(req, res) => {
    console.log(req.params);
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const deleteAuser = await User.findByIdAndDelete(id)
        res.json({
            deleteAuser,
        })

    }catch(error){
        throw new Error(error)

    }
})

//updated a user
const updateaUser = asyncHandler(async(req, res) => {
    //console.log(req.params);
    const {_id} = req.User;
    validateMongoDbId(_id);
    try{
        const updatedaUser = await User.findByIdAndUpdate(
            id,
             {
                firstname: req?.body?.firstname,
                lastname:req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
             },
             {
                new: true,
             }
        )
     res.json(updatedaUser)

    }catch(error){
        throw new Error(error)

    }
})

const blockUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        )
        res.json({
            message:"User is blocked",
        })
    }catch(error){
        throw new Error(error);
    }
})
const unblocked = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        )
        res.json({
            message:"User is unblocked",
        })
    }catch(error){
        throw new Error(error);
    }

})

const userCart = asyncHandler(async(req, res) => {
    const { cart } = req.body
    const { _id } = req.User
    validateMongoDbId(_id)
    try{
        let products = []
        const user = await User.findById(_id)

        const alreadyExistCart = await Cart.findOne({orderby: user._id})
        if(alreadyExistCart){
            alreadyExistCart.remove()
        
        }
        for(let i=0; i<cart.lengt; i++){
            let object = {}
            object.Product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec()
            object.price = getPrice.price;
            products.push(object)
        }
        let cartTotal = 0;
        for(let i=0; i<products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        console.log(products, cartTotal);
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save()
        res.json(newCart)
    }catch(error){
        throw new Error(error)
    }
})

const getUserCart = asyncHandler(async(req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try{
        const cart = await Cart.findOne({orderby: _id}).populate("products.product", "_id title price totalDiscount")
        res.json(cart)

    }catch(error){
        throw new Error(error)
    }


})

const emptyCart = asyncHandler(async(req, res) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try{
        const user = await User.findOne({ _id })
        const cart = await Cart.findByIdAndRemove({orderby: user._id})
        res.json(cart)

    }catch(error){
        throw new Error(error)
    }
})

const applyCoupon = asyncHandler(async(req, res) => {
    const { coupon } = req.body;
    const validCoupon = await Coupon.findOne({ name: coupon })
    if(validCoupon === null){
        throw new Error('Invalid Coupon')
    }
    const user = await User.findOne({ _id })
    let { products, cartTotal} = await Cart.findOne({
        orderby: user._id,

    }).populate("products.product")
    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findByIdAndUpdate(
        {orderby: user._id},
        {totalAfterDiscount},
        {new: true}
    )
    res.json(totalAfterDiscount)
   
})

const createOrder = asyncHandler(async(req, res) => {
    const { COD, couponApplied } = req.body
    const { _id } = req.user
    validateMongoDbId(_id);
    try{
        if(!COD) throw new Error('Create cash order failed');
        const user = await User.findById(_id)
        let userCart = await Cart.findOne({ orderby: user._id })
        let finalAmount = 0;
        if(couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.cartTotal * 100;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id:unique(),
                method:"COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user._id,
            orderStatus:"Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id:item.product._id},
                    update:{$inc: {quantity: -item.count, sold: +item.count }},

                }
            }
        })
   const updated = await Product.bulkWrite(update, {})
   res.json({ message: success })
    }catch(error){
        throw new Error(error);
    }
})

const getOrder = asyncHandler(async(req, res) => {
    const {_id } = req.user;
    validateMongoDbId(_id)
    try{
        const userorders = await Order.findOne({ orderby: _id })
        .populate("products.product")
        .exec();
        res.json(userorders)

    }catch(error){
        throw new Error(error)
    }
})

const updateOrderStatus = asyncHandler(async(req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
             {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                }
    
            }, 
            {new: true}
            )
            res.json(updateOrderStatus)

    }catch(error){
        throw new Error(error)
    }

})

module.exports = {createUser,
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
    }