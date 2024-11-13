const express = require('express')
const authRouter = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')


authRouter.post('/signup', async (req, res, next) => {
    try {
        const username = req.body.username.toLowerCase()
        const isUser = await User.findOne({ username: username })
        if (isUser){
            res.status(403)
            return next(new Error('That username is already taken'))
        }
        const newUser = new User(req.body)
        const savedUser = await newUser.save()
        return res.status(201).send({ user: savedUser.withoutPassword() })
    } catch (err) {
        res.status(500)
        return next(err)
    }
})


authRouter.post('/login', async (req, res, next) => {
    try {
        const username = req.body.username
        const target = await User.findOne({ username: username })
        if (!target){
            res.status(403)
            return next(new Error('Username or password incorrect'))
        }
        const passCheck = await target.checkPassword(req.body.password)
        if(!passCheck){
            res.status(403)
            return next(new Error('Username or password incorrect'))
        }
        const token = jwt.sign(target.withoutPassword(), process.env.SECRET)
        return res.status(200).send({ token, user: target.withoutPassword() })
    } catch (err) {
        res.status(403)
        return next(new Error('Username or password incorrect'))
    }
})


module.exports = authRouter