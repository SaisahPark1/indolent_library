'use strict'

const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess, sendCreated, sendNoContent} = require('../utils/apiResponse')

module.exports = function itemsRouter(repo) {
    const getAllItems = asyncHandler(async (req, res) => {
        const items = await repo.find()
        sendSuccess(res, items)
    })

    const getOneItem = asyncHandler(async (req, res) => {
        const item = await repo.findById(req.params.id)
        if (!item) return res.status(404).json({ success: false, error: {message: "Not Found"} })
        sendSuccess(res, item)
    })

    const createItem = asyncHandler(async (req, res) => {
        const item = await repo.create(req.body)
        sendCreated(res, item)
    })

    const updateItem = asyncHandler(async (req, res) => {
        const item = await repo.update(req.params.id, req.body)
        if (!item) return res.status(404).json({ success: false, error: {message: "Not Found"} })
        sendSuccess(res, item)
    })

    const removeItem = asyncHandler(async (req, res) => {
        const item = await repo.delete(req.params.id)
        if (!item) return res.status(404).json({ success: false, error: {message: "Not Found"} })
        sendNoContent(res)
    })

    const router = express.Router()
    router.get('/', getAllItems)
    router.post('/', createItem)
    router.get('/:id', getOneItem)
    router.patch('/:id', updateItem)
    router.delete('/:id', removeItem)
    return router
}