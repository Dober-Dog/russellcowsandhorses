const express = require('express')
const cowRouter = express.Router()
const Cow = require('../models/cow')

cowRouter.get('/', async (req, res, next) => {
        try {
            const result = await Cow.find()
            res.status(200).send(result)
        } catch (err) {
            res.status(404)
            return next(err)
        }
    })
    
cowRouter.get('/:cowID', async (req, res, next) => {
    try {
        const result = await Cow.findById(req.params.cowID)
        res.status(200).send(result)
    } catch (err) {
        res.status(404)
        return next(err)
    }
})
    
cowRouter.get('/search/gender', async (req, res, next) => {
    try {
        const result = await Cow.find({ gender: req.query.gender })
        res.status(200).send(result)
    } catch (err) {
        res.status(500)
        return next(err)
    }
})

module.exports = cowRouter