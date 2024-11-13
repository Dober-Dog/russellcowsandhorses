const express = require('express')
const horseRouter = express.Router()
const Horse = require('../models/horse')

horseRouter.get('/', async (req, res, next) => {
        try {
            const result = await Horse.find()
            res.status(200).send(result)
        } catch (err) {
            res.status(404)
            return next(err)
        }
    })

horseRouter.get('/:horseID', async (req, res, next) => {
    try {
        const result = await Horse.findById(req.params.horseID)
        res.status(200).send(result)
    } catch (err) {
        res.status(404)
        return next(err)
    }
})

horseRouter.get('/search/gender', async (req, res, next) => {
    try {
        const result = await Horse.find({ gender: req.query.gender })
        res.status(200).send(result)
    } catch (err) {
        res.status(500)
        return next(err)
    }
})



module.exports = horseRouter