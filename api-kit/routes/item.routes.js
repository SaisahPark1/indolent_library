'use strict'

const express = require('express')
const controller = require('../controllers/api.controller.js')

const router = express.Router()

router
    .route('/')
        .get(controller.getAllItems)
        .post(controller.createItem)
router
    .route('/:id')
        .get(controller.getOneItem)
        .put(controller.updateItem)
        .patch(controller.updateItem)
        .delete(controller.removeItem)

// Here there will be more routes each with their own combination of get,put,patch,delete...etc

module.exports = router