'use strict'

const asyncHandler = require('../utils/asyncHandler')
const Item = require('../models/default.model.js')
const {sendSuccess, sendCreated, sendNoContent} = require('../utils/apiResponse')
const ApiError = require('../utils/apiError')


const getAllItems = asyncHandler(async(req, res)=>{
    const item = await Item.find({})
    sendSuccess(res, item)
})

const getOneItem = asyncHandler(async(req, res)=>{
    const item = await Item.findById(req.params.id)
    if(!item) throw ApiError.notFound('Item not Found')
    sendSuccess(res, item)
})

const createItem = asyncHandler(async(req, res) => {
    const item = await Item.create(...req.body)
    sendCreated(res, item)
})


const updateItem = asyncHandler(async(req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new:true, runValidators: true
    })
    if (!item) throw ApiError.notFound('Item not Found')
    sendSuccess(res, item)
})

const removeItem = asyncHandler(async(req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id)
    if (!item) throw apiError.notFound('Item not Found')
    sendNoContent(res)
})

module.exports = {getAllItems, getOneItem, createItem, removeItem, updateItem}