'use strict'

const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess, sendCreated, sendNoContent} = require('../utils/apiResponse')
const guardKit = require("../../guard-kit/index.js")


module.exports = function itemsRouter(repo) {
    const getAllItems = asyncHandler(async (req, res) => {
        const items = await repo.find()
        sendSuccess(res, items)
    })

    const getOneItem = asyncHandler(async (req, res) => {
        const item = await repo.findById(req.params.id)
        if (!item) throw guardKit.ApiError.notFound('Item not found')
        sendSuccess(res, item)
    })

    const createItem = asyncHandler(async (req, res) => {
        const item = await repo.create(req.body)
        sendCreated(res, item)
    })

    const updateItem = asyncHandler(async (req, res) => {
        const item = await repo.update(req.params.id, req.body)
        if (!item) throw guardKit.ApiError.notFound('Item not found')
        sendSuccess(res, item)
    })

    const removeItem = asyncHandler(async (req, res) => {
        const item = await repo.delete(req.params.id)
        if (!item) throw guardKit.ApiError.notFound('Item not found')
        sendNoContent(res)
    })

    const itemSchema = {
        title:  { type: 'string', required: true, minLength: 1 },
        author: { type: 'string' },
        year:   { type: 'number', min: 0 },
    };

    const router = express.Router()
    router.get('/', getAllItems)
    router.post('/', guardKit.validate(itemSchema), createItem)
    router.get('/:id', getOneItem)
    router.patch('/:id', guardKit.validate(itemSchema, 'body', { partial: true }), updateItem)
    router.delete('/:id', removeItem)
    return router
}