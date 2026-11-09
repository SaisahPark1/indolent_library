'use strict'
/**
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [statusCode=200]
 * @param {object} [extra]     the extra is any other top level keys we want to add like {meta}
*/

function sendSuccess(res, data, statusCode = 200, extra={}){
    return res.status(statusCode).json({success: true, data, ...extra})
}

// Whenever a record is created
function sendCreated(res, data){
    return sendSuccess(res, data, 201)
}

// if there is an empty body
function sendNoContent(res){
    return res.status(204).send()
}

module.exports = {sendSuccess, sendCreated, sendNoContent}