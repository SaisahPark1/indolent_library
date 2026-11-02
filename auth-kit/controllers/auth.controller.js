'use strict'

// const {sendSuccess, sendCreated} = require('../utils/apiResponse.js')
// const apiError = require('../utils/apiError.js')
const {signToken} = require('../utils/jwt.js')
const User = require('../models/user.model')
// const asyncHandler = require('../utils/asyncHandler.js')


// const register = asyncHandler(async(req, res) => {
const register = async(req, res) => {
    const {name, email, password} = req.body ?? {}
    // Destructuring so the user cannot edit like {"role": 'admin'}
    const user = await User.create({name, email, password})
    sendCreated(res, {user, token: signToken(user)})
}


// const login = asyncHandler(async(req, res)=>{
const login = async(req, res)=>{
    const {email, password} = req.body ?? {}

    if (!email || !password){
        // throw apiError.badRequest('email and password are required')
        console.log("email and password required")
    }
    const user = await User.findOne({email: String(email).toLowerCase().trim()}).select('+password')
    // .select('+password') overrides the hashing

    if ((!user) || !(await user.comparePassword(password))){
        // throw apiError.unauthorized('Invalid email or password')
        console.log("email and password invalid")
    }
    // making sure that the user exists and the passwords match

    // sendSuccess(res, {user, token:signToken(user)})
    console.log("Yay you logged in")
}


// const me = asyncHandler(async(req, res)=>{
const me = async(req, res)=>{
    /** requireAuth will already have verified so this is just for confirming a saved token is still good
     * Also for refreshing */
    // sendSuccess(res, req.user)
    console.log("You are: ", req.user)
}

module.exports = {register, login, me}