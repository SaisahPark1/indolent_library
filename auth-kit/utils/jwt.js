'use strict'

/**
 * @params {object} user
 * @returns {string} a signed token
 */

const jwt = require('jsonwebtoken')
const {jwtSecret, jwtExpiresIn} = require('../config/env.js')

function signToken(user){
    const payload = {sub: String(user._id), role: user.role}
    return jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiresIn})
}

/**
 * @param {string} token
 * @param {{sub:string, role:string, iat:number, exp:number}}
*/

function verifyToken(token){
    try{
        return jwt.verify(token, jwtSecret)
    } catch (err) {
    //    throw apiError.unauthorized('Invalid Token')
        console.log("Invalid Token")
    }
}

module.exports = {signToken, verifyToken}