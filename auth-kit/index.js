'use strict'

const express = require('express')
// const dataRoutes = require('./data.routes')
const authRoutes = require('./auth.routes')

const router = express.Router()
router.use('/auth', authRoutes)

// router.use('/dataRoutes', dataRoutes)

module.exports = router